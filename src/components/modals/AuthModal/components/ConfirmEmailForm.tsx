import styles from "../AuthModal.module.scss";
import type { ConfirmEmailFormProps } from "../model/types";
import AuthMessages from "./AuthMessages";

const ConfirmEmailForm = ({
  email,
  code,
  isLoading,
  errorMessage,
  successMessage,
  onCodeChange,
  onSubmit,
  onBack,
}: ConfirmEmailFormProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>
        Подтверждение почты
      </h2>
      <p className={styles.form__description}>
        Введите шестизначный код, отправленный на
      </p>
      <strong className={styles.form__email}>{email}</strong>
    </div>

    <label className={`${styles.field} ${styles.field_code}`}>
      <span className={styles.field__label}>Код подтверждения</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={code}
        onChange={onCodeChange}
        placeholder="000000"
        className={styles.field__input}
        minLength={6}
        maxLength={6}
        required
        autoFocus
      />
    </label>

    <AuthMessages errorMessage={errorMessage} successMessage={successMessage} />
    <button
      type="submit"
      className={styles.form__submit}
      disabled={isLoading || code.length !== 6}
    >
      {isLoading ? "Проверяем..." : "Подтвердить"}
    </button>
    <button
      type="button"
      className={styles.form__switch}
      onClick={onBack}
      disabled={isLoading}
    >
      Изменить данные регистрации
    </button>
  </form>
);

export default ConfirmEmailForm;
