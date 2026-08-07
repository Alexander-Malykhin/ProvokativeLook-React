import styles from "../AuthModal.module.scss";
import type { LoginFormProps } from "../model/types";
import AuthMessages from "./AuthMessages";

const LoginForm = ({
  form,
  isLoading,
  errorMessage,
  successMessage,
  onChange,
  onSubmit,
  onSwitch,
}: LoginFormProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>
        Вход в кабинет
      </h2>
      <p className={styles.form__description}>
        Введите электронную почту и пароль
      </p>
    </div>

    <div className={styles.form__fields}>
      <label className={styles.field}>
        <span className={styles.field__label}>Электронная почта</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="mail@example.ru"
          autoComplete="email"
          className={styles.field__input}
          required
        />
      </label>
      <label className={styles.field}>
        <span className={styles.field__label}>Пароль</span>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Введите пароль"
          autoComplete="current-password"
          className={styles.field__input}
          required
        />
      </label>
    </div>

    <AuthMessages errorMessage={errorMessage} successMessage={successMessage} />
    <button type="submit" className={styles.form__submit} disabled={isLoading}>
      {isLoading ? "Входим..." : "Войти"}
    </button>
    <button
      type="button"
      className={styles.form__switch}
      onClick={onSwitch}
      disabled={isLoading}
    >
      Нет аккаунта? Зарегистрироваться
    </button>
  </form>
);

export default LoginForm;
