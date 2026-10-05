import styles from "../AuthModal.module.scss";
import type { LoginFormProps } from "../model/types";
import AuthMessages from "./AuthMessages";
import PasswordInput from "./PasswordInput";
const LoginForm = ({ form, isLoading, errorMessage, successMessage, fieldErrors, onChange, onSubmit, onSwitch, onForgotPassword, }: LoginFormProps) => (<form className={styles.form} onSubmit={onSubmit} noValidate>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>
        Вход в кабинет
      </h2>
      <p className={styles.form__description}>
        Введите электронную почту и пароль
      </p>
    </div>

    <div className={styles.form__fields}>
      <label className={`${styles.field} ${fieldErrors.email ? styles.field_error : ""}`}>
        <span className={styles.field__label}>Электронная почта</span>
        <input type="email" name="email" value={form.email} onChange={onChange} placeholder="mail@example.ru" autoComplete="email" className={styles.field__input} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "login-email-error" : undefined}/>
        {fieldErrors.email && (<span id="login-email-error" className={styles.field__error}>{fieldErrors.email}</span>)}
      </label>
      <PasswordInput name="password" value={form.password} label="Пароль" placeholder="Введите пароль" autoComplete="current-password" onChange={onChange} error={fieldErrors.password}/>
    </div>

    <button type="button" className={styles.form__switch} onClick={onForgotPassword} disabled={isLoading}>
      Забыли пароль?
    </button>
    <AuthMessages errorMessage={errorMessage} successMessage={successMessage}/>
    <button type="submit" className={styles.form__submit} disabled={isLoading}>
      {isLoading ? "Входим..." : "Войти"}
    </button>
    <button type="button" className={styles.form__switch} onClick={onSwitch} disabled={isLoading}>
      Войти по телефону
    </button>
  </form>);
export default LoginForm;

