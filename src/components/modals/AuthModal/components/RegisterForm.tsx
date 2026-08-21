import type { ChangeEvent } from "react";
import styles from "../AuthModal.module.scss";
import type { RegisterFormProps } from "../model/types";
import AuthMessages from "./AuthMessages";
import PasswordInput from "./PasswordInput";
import PhoneInput from "@components/common/PhoneInput/PhoneInput";
const RegisterForm = ({ form, isLoading, errorMessage, fieldErrors, onChange, onSubmit, onSwitch, }: RegisterFormProps) => {
    const passwordChecks = [
        { label: "8+ символов", passed: form.password.length >= 8 },
        { label: "заглавная буква", passed: /[A-ZА-ЯЁ]/.test(form.password) },
        { label: "цифра", passed: /\d/.test(form.password) },
        { label: "спецсимвол", passed: /[^A-Za-zА-Яа-яЁё0-9]/.test(form.password) },
    ];
    return (<form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.form__header}>
        <h2 id="auth-modal-title" className={styles.form__title}>Регистрация</h2>
        <p className={styles.form__description}>Заполните данные для создания аккаунта</p>
      </div>

      <div className={styles.form__fields}>
        <div className={styles.form__row}>
          <label className={`${styles.field} ${fieldErrors.firstName ? styles.field_error : ""}`}>
            <span className={styles.field__label}>Имя</span>
            <input type="text" name="firstName" value={form.firstName} onChange={onChange} placeholder="Александр" autoComplete="given-name" className={styles.field__input} data-register-field="firstName" aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}/>
            {fieldErrors.firstName && <span id="firstName-error" className={styles.field__error}>{fieldErrors.firstName}</span>}
          </label>

          <label className={`${styles.field} ${fieldErrors.lastName ? styles.field_error : ""}`}>
            <span className={styles.field__label}>Фамилия</span>
            <input type="text" name="lastName" value={form.lastName} onChange={onChange} placeholder="Малыхин" autoComplete="family-name" className={styles.field__input} data-register-field="lastName" aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}/>
            {fieldErrors.lastName && <span id="lastName-error" className={styles.field__error}>{fieldErrors.lastName}</span>}
          </label>
        </div>

        <label className={`${styles.field} ${fieldErrors.email ? styles.field_error : ""}`}>
          <span className={styles.field__label}>Электронная почта</span>
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder="mail@example.ru" autoComplete="email" className={styles.field__input} data-register-field="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined}/>
          {fieldErrors.email && <span id="email-error" className={styles.field__error}>{fieldErrors.email}</span>}
        </label>

        <PasswordInput name="password" value={form.password} label="Пароль" placeholder="Введите пароль" autoComplete="new-password" onChange={onChange} error={fieldErrors.password} dataField="password"/>

        <PasswordInput name="confirmPassword" value={form.confirmPassword} label="Повторите пароль" placeholder="Повторите пароль" autoComplete="new-password" onChange={onChange} error={fieldErrors.confirmPassword} dataField="confirmPassword"/>

        <label className={`${styles.field} ${fieldErrors.phone ? styles.field_error : ""}`}>
          <span className={styles.field__label}>Телефон</span>
          <PhoneInput value={form.phone} onChange={(value) => onChange({ target: { name: "phone", value } } as ChangeEvent<HTMLInputElement>)} className={styles.field__input} selectClassName={styles.field__phoneCountry} ariaInvalid={Boolean(fieldErrors.phone)} dataField="phone"/>
          {fieldErrors.phone && <span id="phone-error" className={styles.field__error}>{fieldErrors.phone}</span>}
        </label>
      </div>

      <div className={styles.form__passwordRules} aria-live="polite">
        {passwordChecks.map((check) => (<span key={check.label} className={`${styles.form__passwordRule} ${check.passed ? styles.form__passwordRule_passed : ""}`}>
            <span aria-hidden="true">{check.passed ? "✓" : "•"}</span> {check.label}
          </span>))}
      </div>

      <AuthMessages errorMessage={errorMessage}/>
      <button type="submit" className={styles.form__submit} disabled={isLoading}>
        {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
      </button>
      <button type="button" className={styles.form__switch} onClick={onSwitch} disabled={isLoading}>
        Уже есть аккаунт? Войти
      </button>
    </form>);
};
export default RegisterForm;

