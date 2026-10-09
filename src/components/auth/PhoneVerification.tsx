import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import PhoneInput from '@components/common/PhoneInput/PhoneInput';
import { AUTH_PHONE_COUNTRIES, isValidPhone, normalizePhone, detectCountry } from '@components/common/PhoneInput/phone';
import { baseApi } from '@store/api/baseApi';
import { useAppDispatch } from '@store/hooks';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import { PhoneCheckQueue, isTemporaryPhoneError, isPhoneCheckResult, getPhoneRetryAfter, type PhoneCheckInput, type PhoneCheckResult } from './phoneCheck';
import styles from './PhoneVerification.module.scss';

const phoneApi = baseApi.injectEndpoints({ endpoints: builder => ({
    sendPhone: builder.mutation<PhoneCheckResult, { phone: string; purpose: 'login' | 'register' | 'change' }>({
        query: body => ({ url: 'auth/phone/send', method: 'POST', body,
            validateStatus: (response, result) => response.status === 200 && isPhoneCheckResult(result) && typeof result.challenge === 'string' && result.challenge.length > 0 }),
    }),
    checkPhone: builder.mutation<PhoneCheckResult, PhoneCheckInput>({
        query: body => ({ url: 'auth/phone/check', method: 'POST', body, timeout: 45000,
            validateStatus: (response, result) => response.status === 200 && isPhoneCheckResult(result) }),
    }),
}) });

export default function PhoneVerification({ purpose = 'login', onDone }: {
    purpose?: 'login' | 'register' | 'change'; onDone: () => void;
}) {
    const dispatch = useAppDispatch();
    const [phone, setPhone] = useState('+7');
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [challenge, setChallenge] = useState('');
    const [stage, setStage] = useState<'phone' | PhoneCheckResult['state']>('phone');
    const [channel, setChannel] = useState<'mobile-id' | 'sms'>('mobile-id');
    const [expiresAt, setExpiresAt] = useState(0);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [retryAt, setRetryAt] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [queue] = useState(() => new PhoneCheckQueue());
    const [send, sendState] = phoneApi.useSendPhoneMutation();
    const [check] = phoneApi.useCheckPhoneMutation();
    const submittingRef = useRef(false);
    const lifetime = useRef(new AbortController());
    const doneRef = useRef(onDone);

    useEffect(() => { doneRef.current = onDone; }, [onDone]);
    useEffect(() => {
        lifetime.current = new AbortController();
        return () => lifetime.current.abort();
    }, []);

    const reset = useCallback((message = '') => {
        lifetime.current.abort();
        lifetime.current = new AbortController();
        submittingRef.current = false;
        setSubmitting(false);
        setChallenge('');
        setStage('phone');
        setCode('');
        setNotice('');
        setError(message);
    }, []);

    const applyResult = useCallback((result: PhoneCheckResult) => {
        setStage(result.state);
        setError('');
        setNotice('');
        if (['processing', 'email', 'done'].includes(result.state)) setCode('');
        if (result.state === 'done') {
            doneRef.current();
            dispatch(baseApi.util.invalidateTags(['User', 'Cart', 'Favorites', 'Addresses', 'Orders']));
        }
    }, [dispatch]);

    const requestCheck = useCallback(async (input: PhoneCheckInput) => {
        const signal = lifetime.current.signal;
        signal.throwIfAborted();
        const request = check(input);
        const abort = () => request.abort();
        signal.addEventListener('abort', abort, { once: true });
        try { return await request.unwrap(); }
        finally { signal.removeEventListener('abort', abort); }
    }, [check]);

    useEffect(() => {
        const timer = window.setInterval(() => setRemaining(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000))), 1000);
        return () => clearInterval(timer);
    }, [retryAt]);

    useEffect(() => {
        if (!challenge || !expiresAt || stage === 'done') return;
        const timer = window.setTimeout(() => reset('Подтверждение истекло. Запросите новый код.'), Math.max(0, expiresAt - Date.now()));
        return () => clearTimeout(timer);
    }, [challenge, expiresAt, stage, reset]);

    useEffect(() => {
        if (channel === 'sms' || !challenge || !['pending', 'code', 'processing'].includes(stage)) return;
        let cancelled = false;
        const timer = window.setInterval(async () => {
            if (submittingRef.current) return;
            const request = queue.poll(requestCheck, { challenge });
            if (!request) return;
            try {
                const result = await request;
                // A queued submission owns this result and any following retries.
                if (!cancelled && !submittingRef.current) {
                    setStage(result.state);
                    setNotice('');
                    if (result.state === 'email' || result.state === 'done') applyResult(result);
                }
            } catch (failure) {
                if (cancelled || submittingRef.current) return;
                const status = typeof failure === 'object' && failure !== null && 'status' in failure ? failure.status : undefined;
                if (typeof status === 'number' && status >= 400 && status < 500) reset(getRequestErrorMessage(failure));
                else setNotice('Ожидаем ответ сервиса подтверждения…');
            }
        }, 3500);
        return () => { cancelled = true; clearInterval(timer); };
    }, [challenge, stage, channel, queue, requestCheck, applyResult, reset]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (submittingRef.current || stage === 'processing' || stage === 'done') return;
        const signal = lifetime.current.signal;
        const previousStage = stage;
        submittingRef.current = true;
        setSubmitting(true);
        setError('');
        setNotice('');
        try {
            if (stage === 'phone') {
                if (!isValidPhone(phone)) throw new Error('Введите корректный номер телефона');
                if (!AUTH_PHONE_COUNTRIES.includes(detectCountry(phone))) throw new Error('Для этого номера воспользуйтесь входом или регистрацией по почте.');
                const result = await send({ phone: normalizePhone(phone, detectCountry(phone)), purpose }).unwrap();
                if (signal.aborted) return;
                setChallenge(result.challenge ?? '');
                setStage(result.state);
                setChannel(result.channel ?? 'mobile-id');
                setCode('');
                setRetryAt(Date.now() + (result.retryAfter ?? 60) * 1000);
                setRemaining(result.retryAfter ?? 60);
                setExpiresAt(Date.now() + (result.expiresIn ?? 300) * 1000);
            } else {
                if (stage !== 'email') setStage('processing');
                const result = await queue.submit(requestCheck, { challenge, ...(stage === 'email' ? { email } : { code }) }, {
                    signal,
                    onRetry: () => setNotice('Сервис ещё обрабатывает запрос. Повторяем проверку автоматически…'),
                });
                if (!signal.aborted) applyResult(result);
            }
        } catch (failure) {
            if (signal.aborted) return;
            setStage(previousStage);
            setNotice('');
            const retryAfter = getPhoneRetryAfter(failure);
            if (previousStage === 'phone' && retryAfter !== null) {
                setRetryAt(Date.now() + retryAfter * 1000);
                setRemaining(retryAfter);
                setError('Слишком много запросов. Дождитесь окончания таймера.');
                return;
            }
            setError(isTemporaryPhoneError(failure)
                ? 'Сервис подтверждения временно не отвечает. Попробуйте подтвердить код чуть позже.'
                : failure instanceof Error ? failure.message : getRequestErrorMessage(failure));
        } finally {
            if (!signal.aborted) { submittingRef.current = false; setSubmitting(false); }
        }
    };

    const busy = sendState.isLoading || submitting;
    return <form className={styles.form} onSubmit={submit}>
        <h2 id="auth-modal-title">{purpose === 'change' ? 'Изменить телефон' : purpose === 'register' ? 'Регистрация по телефону' : 'Вход по телефону'}</h2>
        {stage === 'phone' ? <>
            <p>{purpose === 'change' ? 'Подтвердите новый номер телефона.' : purpose === 'register' ? 'Подтвердите номер телефона, затем укажите email для чеков и заказов.' : 'Введите ваш номер телефона и подтвердите вход.'}</p>
            <PhoneInput value={phone} onChange={setPhone} countryCodes={AUTH_PHONE_COUNTRIES} required disabled={busy} />
            <button className={styles.primary} disabled={busy || remaining > 0}>{busy ? 'Отправляем…' : remaining ? 'Повторить через ' + remaining + ' с' : 'Получить подтверждение'}</button>
        </> : stage === 'processing' ? <p role="status">Проверяем код. Дождитесь подтверждения…</p> : stage === 'email' ? <>
            <p>Телефон подтверждён. Укажите email для чеков и информации о заказах. Для входа в дальнейшем используйте телефон.</p>
            <label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required disabled={busy} /></label>
            <button className={styles.primary} disabled={busy}>Продолжить</button>
            <button type="button" disabled={busy} onClick={() => reset()}>Начать заново</button>
        </> : stage === 'done' ? <p role="status">Телефон подтверждён.</p> : <>
            <p>{stage === 'code' ? 'Введите код из SMS на ' + phone : 'Подтвердите вход в уведомлении на телефоне ' + phone + '. Если придёт SMS, введите код.'}</p>
            <label>Код подтверждения<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, channel === 'sms' ? 6 : 8))} minLength={channel === 'sms' ? 6 : 4} maxLength={channel === 'sms' ? 6 : 8} required disabled={busy} /></label>
            <button className={styles.primary} disabled={busy || code.length < (channel === 'sms' ? 6 : 4)}>Подтвердить</button>
            <button type="button" disabled={busy || remaining > 0} onClick={() => reset()}>{remaining ? 'Повторить через ' + remaining + ' с' : 'Другой номер / повторить'}</button>
        </>}
        {notice && <p role="status">{notice}</p>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
    </form>;
}
