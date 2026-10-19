import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import PhoneInput from '@components/common/PhoneInput/PhoneInput';
import PasswordInput from '@components/modals/AuthModal/components/PasswordInput';
import { AUTH_PHONE_COUNTRIES, isValidPhone, normalizePhone, detectCountry } from '@components/common/PhoneInput/phone';
import { baseApi } from '@store/api/baseApi';
import { useAppDispatch } from '@store/hooks';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import {
  PhoneCheckQueue,
  isTemporaryPhoneError,
  isPhoneCheckResult,
  getPhoneRetryAfter,
  type PhoneCheckInput,
  type PhoneCheckResult,
} from './phoneCheck';
import styles from './PhoneVerification.module.scss';

const phoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendPhone: builder.mutation<PhoneCheckResult, { phone: string; purpose: 'login' | 'register' | 'change' }>({
      query: (body) => ({
        url: 'auth/phone/send',
        method: 'POST',
        body,
        validateStatus: (response, result) =>
          response.status === 200 &&
          isPhoneCheckResult(result) &&
          typeof result.challenge === 'string' &&
          result.challenge.length > 0,
      }),
    }),
    checkPhone: builder.mutation<PhoneCheckResult, PhoneCheckInput>({
      query: (body) => ({
        url: 'auth/phone/check',
        method: 'POST',
        body,
        timeout: 45000,
        validateStatus: (response, result) => response.status === 200 && isPhoneCheckResult(result),
      }),
    }),
  }),
});

export default function PhoneVerification({
  purpose = 'login',
  onDone,
}: {
  purpose?: 'login' | 'register' | 'change';
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('+7');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(true);
  const [challenge, setChallenge] = useState('');
  const [stage, setStage] = useState<'phone' | PhoneCheckResult['state']>('phone');
  const [channel, setChannel] = useState<'mobile-id' | 'sms'>('mobile-id');
  const [expiresAt, setExpiresAt] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [queue] = useState(() => new PhoneCheckQueue());
  const [send, sendState] = phoneApi.useSendPhoneMutation();
  const [check] = phoneApi.useCheckPhoneMutation();
  const submittingRef = useRef(false);
  const lifetime = useRef(new AbortController());
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);
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
    setPassword('');
    setConfirmPassword('');
    setNotice('');
    setError(message);
  }, []);

  const applyResult = useCallback(
    (result: PhoneCheckResult) => {
      if (result.state === 'email') setRequiresPassword(result.requiresPassword !== false);
      setStage(result.state);
      setError('');
      setNotice('');
      if (['processing', 'email', 'done'].includes(result.state)) setCode('');
      if (result.state === 'done') {
        setPassword('');
        setConfirmPassword('');
        doneRef.current();
        dispatch(baseApi.util.invalidateTags(['User', 'Cart', 'Favorites', 'Addresses', 'Orders']));
      }
    },
    [dispatch],
  );

  const requestCheck = useCallback(
    async (input: PhoneCheckInput) => {
      const signal = lifetime.current.signal;
      signal.throwIfAborted();
      const request = check(input);
      const abort = () => request.abort();
      signal.addEventListener('abort', abort, { once: true });
      try {
        return await request.unwrap();
      } finally {
        signal.removeEventListener('abort', abort);
      }
    },
    [check],
  );

  useEffect(() => {
    if (!challenge || !expiresAt || stage === 'done') return;
    const timer = window.setTimeout(
      () => reset('Подтверждение истекло. Запросите новый код.'),
      Math.max(0, expiresAt - Date.now()),
    );
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

        if (!cancelled && !submittingRef.current) {
          setStage(result.state);
          setNotice('');
          if (result.state === 'email' || result.state === 'done') applyResult(result);
        }
      } catch (failure) {
        if (cancelled || submittingRef.current) return;
        const status =
          typeof failure === 'object' && failure !== null && 'status' in failure ? failure.status : undefined;
        if (typeof status === 'number' && status >= 400 && status < 500) reset(getRequestErrorMessage(failure));
        else setNotice('Ожидаем ответ сервиса подтверждения…');
      }
    }, 3500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
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
        if (!AUTH_PHONE_COUNTRIES.includes(detectCountry(phone)))
          throw new Error('Для этого номера воспользуйтесь входом или регистрацией по почте.');
        const result = await send({ phone: normalizePhone(phone, detectCountry(phone)), purpose }).unwrap();
        if (signal.aborted) return;
        setChallenge(result.challenge ?? '');
        setStage(result.state);
        setChannel(result.channel ?? 'mobile-id');
        setCode('');
        setExpiresAt(Date.now() + (result.expiresIn ?? 300) * 1000);
        if (result.state === 'done' || result.state === 'email') applyResult(result);
      } else {
        if (stage === 'email' && requiresPassword) {
          if (password.length < 8) throw new Error('Пароль должен содержать минимум 8 символов');
          if (
            /[А-Яа-яЁё]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/\d/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
          ) {
            throw new Error('Используйте заглавную и строчную латинские буквы, цифру и спецсимвол');
          }
          if (password !== confirmPassword) throw new Error('Пароли не совпадают');
        }
        if (stage !== 'email') setStage('processing');
        const result = await queue.submit(
          requestCheck,
          {
            challenge,
            ...(stage === 'email' ? { email, ...(requiresPassword ? { password, confirmPassword } : {}) } : { code }),
          },
          {
            signal,
            onRetry: () => setNotice('Сервис ещё обрабатывает запрос. Повторяем проверку автоматически…'),
          },
        );
        if (!signal.aborted) applyResult(result);
      }
    } catch (failure) {
      if (signal.aborted) return;
      setStage(previousStage);
      setNotice('');
      const retryAfter = getPhoneRetryAfter(failure);
      if (previousStage === 'phone' && retryAfter !== null) {
        setError('Сервис пока не принял отправку. Попробуйте ещё раз чуть позже.');
        return;
      }
      setError(
        isTemporaryPhoneError(failure)
          ? 'Сервис подтверждения временно не отвечает. Попробуйте подтвердить код чуть позже.'
          : failure instanceof Error
            ? failure.message
            : getRequestErrorMessage(failure),
      );
    } finally {
      if (!signal.aborted) {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }
  };

  const busy = sendState.isLoading || submitting;
  const loader = (
    <div className={styles.loading} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Подтверждаем…</span>
    </div>
  );
  return (
    <form className={styles.form} onSubmit={submit} aria-busy={busy || stage === 'processing'}>
      <h2 id="auth-modal-title">
        {purpose === 'change'
          ? 'Изменить телефон'
          : purpose === 'register'
            ? 'Регистрация по телефону'
            : 'Вход по телефону'}
      </h2>
      {stage === 'phone' ? (
        <>
          <p>
            {purpose === 'change'
              ? 'Подтвердите новый номер телефона.'
              : purpose === 'register'
                ? 'Подтвердите номер телефона, затем укажите email и создайте пароль.'
                : 'Введите ваш номер телефона и подтвердите вход.'}
          </p>
          <PhoneInput value={phone} onChange={setPhone} countryCodes={AUTH_PHONE_COUNTRIES} required disabled={busy} />
          <button className={styles.primary} disabled={busy}>
            {busy ? (
              <>
                <span className={styles.buttonSpinner} aria-hidden="true" />
                Отправляем…
              </>
            ) : (
              'Получить подтверждение'
            )}
          </button>
        </>
      ) : stage === 'processing' ? (
        loader
      ) : stage === 'email' ? (
        <>
          <p>
            {requiresPassword
              ? 'Телефон подтверждён. Укажите email и создайте пароль. Войти в личный кабинет можно будет по телефону или по email и паролю.'
              : 'Телефон подтверждён. Укажите email для чеков и информации о заказах.'}
          </p>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={busy}
            />
          </label>
          {requiresPassword && (
            <>
              <PasswordInput
                className={styles.passwordField}
                name="password"
                value={password}
                label="Пароль"
                placeholder="Придумайте пароль"
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                disabled={busy}
              />
              <PasswordInput
                className={styles.passwordField}
                name="confirmPassword"
                value={confirmPassword}
                label="Повторите пароль"
                placeholder="Повторите пароль"
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={busy}
              />
              <p>Минимум 8 символов: заглавная и строчная латинские буквы, цифра и спецсимвол.</p>
            </>
          )}
          <button className={styles.primary} disabled={busy}>
            {busy ? (
              <>
                <span className={styles.buttonSpinner} aria-hidden="true" />
                Сохраняем…
              </>
            ) : (
              'Продолжить'
            )}
          </button>
          <button type="button" disabled={busy} onClick={() => reset()}>
            Начать заново
          </button>
        </>
      ) : stage === 'done' ? (
        <p role="status">Телефон подтверждён.</p>
      ) : (
        <>
          <p>
            {stage === 'code'
              ? 'Введите код из SMS на ' + phone
              : 'Подтвердите вход в уведомлении на телефоне ' + phone + '. Если придёт SMS, введите код.'}
          </p>
          <label>
            Код подтверждения
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, channel === 'sms' ? 6 : 8))}
              minLength={channel === 'sms' ? 6 : 4}
              maxLength={channel === 'sms' ? 6 : 8}
              required
              disabled={busy}
            />
          </label>
          <button className={styles.primary} disabled={busy || code.length < (channel === 'sms' ? 6 : 4)}>
            Подтвердить
          </button>
          <button type="button" disabled={busy} onClick={() => reset()}>
            Другой номер / повторить
          </button>
        </>
      )}
      {notice && stage !== 'processing' && loader}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
