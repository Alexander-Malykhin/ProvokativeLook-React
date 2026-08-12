import styles from "../AuthModal.module.scss";
import type { RegisterFormProps } from "../model/types";
import AuthMessages from "./AuthMessages";
import PasswordInput from "./PasswordInput";

const fields = [
  {
    name: "firstName",
    label: "Имя",
    type: "text",
    placeholder: "Александр",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Фамилия",
    type: "text",
    placeholder: "Малыхин",
    autoComplete: "family-name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (999) 999-99-99",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Электронная почта",
    type: "email",
    placeholder: "mail@example.ru",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Пароль",
    type: "password",
    placeholder: "Введите пароль",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Повторите пароль",
    type: "password",
    placeholder: "Повторите пароль",
    autoComplete: "new-password",
  },
] as const;

const RegisterForm = ({
  form,
  isLoading,
  errorMessage,
  onChange,
  onSubmit,
  onSwitch,
}: RegisterFormProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.form__header}>
      <h2 id="auth-modal-title" className={styles.form__title}>
        Регистрация
      </h2>
      <p className={styles.form__description}>
        Заполните данные для создания аккаунта
      </p>
    </div>

    <div className={styles.form__fields}>
      {fields.map((field, index) => {
        const input = field.type === "password" ? (
          <PasswordInput
            key={field.name}
            name={field.name}
            value={form[field.name]}
            label={field.label}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            onChange={onChange}
          />
        ) : (
          <label key={field.name} className={styles.field}>
            <span className={styles.field__label}>{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              className={styles.field__input}
              required
            />
          </label>
        );

        if (index === 0) {
          return (
            <div key="name-row" className={styles.form__row}>
              {input}
              <label className={styles.field}>
                <span className={styles.field__label}>{fields[1].label}</span>
                <input
                  type={fields[1].type}
                  name={fields[1].name}
                  value={form.lastName}
                  onChange={onChange}
                  placeholder={fields[1].placeholder}
                  autoComplete={fields[1].autoComplete}
                  className={styles.field__input}
                  required
                />
              </label>
            </div>
          );
        }

        return index === 1 ? null : input;
      })}
    </div>

    <p className={styles.form__hint}>
      Пароль должен содержать заглавную букву, цифру и специальный символ
    </p>
    <AuthMessages errorMessage={errorMessage} />
    <button type="submit" className={styles.form__submit} disabled={isLoading}>
      {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
    </button>
    <button
      type="button"
      className={styles.form__switch}
      onClick={onSwitch}
      disabled={isLoading}
    >
      Уже есть аккаунт? Войти
    </button>
  </form>
);

export default RegisterForm;
