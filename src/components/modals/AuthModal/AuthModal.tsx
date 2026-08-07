import Modal from "@UI/overlays/Modal/Modal";
import styles from "./AuthModal.module.scss";
import AuthTabs from "./components/AuthTabs";
import ConfirmEmailForm from "./components/ConfirmEmailForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useAuthFlow } from "./hooks/useAuthFlow";

const AuthModal = () => {
  const auth = useAuthFlow();

  return (
    <Modal
      open={auth.active}
      onClose={auth.close}
      overlayClassName={styles.overlay}
      contentClassName={styles.modal}
      ariaLabelledBy="auth-modal-title"
      closeDisabled={auth.isLoading}
    >
      <button
        type="button"
        className={styles.modal__close}
        onClick={auth.close}
        aria-label="Закрыть"
        disabled={auth.isLoading}
      >
        <span />
        <span />
      </button>

      {auth.mode !== "confirm" && (
        <AuthTabs
          mode={auth.mode}
          disabled={auth.isLoading}
          onChange={auth.changeMode}
        />
      )}

      {auth.mode === "login" && (
        <LoginForm
          form={auth.loginForm}
          isLoading={auth.isLoginLoading}
          errorMessage={auth.errorMessage}
          successMessage={auth.successMessage}
          onChange={auth.handleLoginChange}
          onSubmit={(event) => void auth.submitLogin(event)}
          onSwitch={() => auth.changeMode("register")}
        />
      )}

      {auth.mode === "register" && (
        <RegisterForm
          form={auth.registerForm}
          isLoading={auth.isRegisterLoading}
          errorMessage={auth.errorMessage}
          onChange={auth.handleRegisterChange}
          onSubmit={(event) => void auth.submitRegister(event)}
          onSwitch={() => auth.changeMode("login")}
        />
      )}

      {auth.mode === "confirm" && (
        <ConfirmEmailForm
          email={auth.registerForm.email}
          code={auth.confirmForm.code}
          isLoading={auth.isConfirmLoading}
          errorMessage={auth.errorMessage}
          successMessage={auth.successMessage}
          onCodeChange={auth.handleConfirmChange}
          onSubmit={(event) => void auth.submitConfirm(event)}
          onBack={() => auth.changeMode("register")}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
