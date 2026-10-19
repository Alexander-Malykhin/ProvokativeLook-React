import Modal from '@UI/overlays/Modal/Modal';
import { useEffect, useState } from 'react';
import EmailLogin from './components/EmailLogin';
import { useGetUserQuery } from '@store/api/user/userApi';
import { animateModalClose } from '@UI/overlays/Modal/animateModalClose';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { closeAuthModal, setAuthModalMode } from '@store/slices/toggleAuthModalSlice';
import { close as closeProfileMenu } from '@store/slices/toggleMenuProfileSlice';
import PhoneVerification from '@components/auth/PhoneVerification';
import styles from './AuthModal.module.scss';
function AuthMethods({ onDone }: { onDone: () => void }) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.toggleAuthModal.mode);
  const [emailLogin, setEmailLogin] = useState(false);
  const [phonePurpose, setPhonePurpose] = useState<'login' | 'register'>(mode === 'register' ? 'register' : 'login');
  if (emailLogin)
    return (
      <EmailLogin
        onPhone={(purpose) => {
          setPhonePurpose(purpose);
          setEmailLogin(false);
          dispatch(setAuthModalMode(purpose));
        }}
      />
    );
  return (
    <>
      <PhoneVerification key={phonePurpose} purpose={phonePurpose} onDone={onDone} />
      <button
        type="button"
        className={styles.form__switch}
        onClick={() => {
          const next = phonePurpose === 'login' ? 'register' : 'login';
          setPhonePurpose(next);
          dispatch(setAuthModalMode(next));
        }}
      >
        {phonePurpose === 'register' ? 'Уже есть аккаунт? Войти' : 'Зарегистрироваться по телефону'}
      </button>
      <p className={styles.fallbackHint}>Не получается подтвердить телефон?</p>
      <button
        type="button"
        className={styles.form__switch}
        onClick={() => {
          dispatch(setAuthModalMode(phonePurpose));
          setEmailLogin(true);
        }}
      >
        {phonePurpose === 'register' ? 'Зарегистрироваться по почте' : 'Войти по почте и паролю'}
      </button>
    </>
  );
}
export default function AuthModal() {
  const active = useAppSelector((state) => state.toggleAuthModal.active);
  const dispatch = useAppDispatch();
  const { data, isFetching, error, refetch } = useGetUserQuery(undefined, {
    skip: !active,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const authenticated = Boolean(data?.success && data.user && !error && !isFetching);
  const unauthorized = error && 'status' in error && error.status === 401;
  useEffect(() => {
    if (active && authenticated) dispatch(closeAuthModal());
  }, [active, authenticated, dispatch]);
  const close = () => animateModalClose(() => dispatch(closeAuthModal()));
  return (
    <Modal
      open={active}
      onClose={close}
      overlayClassName={styles.overlay}
      contentClassName={styles.modal}
      ariaLabelledBy="auth-modal-title"
    >
      <button type="button" className={styles.modal__close} onClick={close} aria-label="Закрыть">
        <span />
        <span />
      </button>
      {active && !authenticated && (
        <>
          <AuthMethods
            onDone={() => {
              dispatch(closeProfileMenu());
              close();
            }}
          />
          {error && !unauthorized && (
            <p role="status" className={styles.connectionStatus}>
              Не удалось обновить состояние входа. Введённые данные сохранены.{' '}
              <button type="button" disabled={isFetching} onClick={() => void refetch()}>
                {isFetching ? 'Проверяем…' : 'Повторить проверку'}
              </button>
            </p>
          )}
        </>
      )}
    </Modal>
  );
}
