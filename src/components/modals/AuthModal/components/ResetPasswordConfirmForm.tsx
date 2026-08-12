import styles from "../AuthModal.module.scss";
import AuthMessages from "./AuthMessages";
import PasswordInput from "./PasswordInput";

interface Props {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  errorMessage: string;
  successMessage?: string;
  onChange: (field: "code" | "password" | "confirmPassword", value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const ResetPasswordConfirmForm = ({ email, code, password, confirmPassword, isLoading, errorMessage, successMessage, onChange, onSubmit, onBack }: Props) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>Новый пароль</h2>
      <p className={styles.form__description}>Код отправлен на {email}</p>
    </div>
    <div className={styles.form__fields}>
      <label className={styles.field}>
        <span className={styles.field__label}>Код из письма</span>
        <input type="text" inputMode="numeric" value={code} onChange={(e) => onChange("code", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className={styles.field__input} required />
      </label>
      <PasswordInput name="password" value={password} label="Новый пароль" placeholder="Введите пароль" autoComplete="new-password" onChange={(e) => onChange("password", e.target.value)} />
      <PasswordInput name="confirmPassword" value={confirmPassword} label="Повторите пароль" placeholder="Повторите пароль" autoComplete="new-password" onChange={(e) => onChange("confirmPassword", e.target.value)} />
    </div>
    <AuthMessages errorMessage={errorMessage} successMessage={successMessage} />
    <button type="submit" className={styles.form__submit} disabled={isLoading}>{isLoading ? "Сохраняем..." : "Изменить пароль"}</button>
    <button type="button" className={styles.form__switch} onClick={onBack} disabled={isLoading}>Вернуться ко входу</button>
  </form>
);
export default ResetPasswordConfirmForm;
