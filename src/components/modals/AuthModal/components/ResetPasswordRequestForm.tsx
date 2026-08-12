import styles from "../AuthModal.module.scss";
import AuthMessages from "./AuthMessages";

interface Props {
  email: string;
  isLoading: boolean;
  errorMessage: string;
  successMessage?: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const ResetPasswordRequestForm = ({ email, isLoading, errorMessage, successMessage, onEmailChange, onSubmit, onBack }: Props) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>Восстановление пароля</h2>
      <p className={styles.form__description}>Введите электронную почту аккаунта</p>
    </div>
    <div className={styles.form__fields}>
      <label className={styles.field}>
        <span className={styles.field__label}>Электронная почта</span>
        <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="mail@example.ru" autoComplete="email" className={styles.field__input} required />
      </label>
    </div>
    <AuthMessages errorMessage={errorMessage} successMessage={successMessage} />
    <button type="submit" className={styles.form__submit} disabled={isLoading}>{isLoading ? "Отправляем..." : "Получить код"}</button>
    <button type="button" className={styles.form__switch} onClick={onBack} disabled={isLoading}>Вернуться ко входу</button>
  </form>
);
export default ResetPasswordRequestForm;
