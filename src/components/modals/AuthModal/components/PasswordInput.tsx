import { useState, type ChangeEvent } from "react";
import styles from "../AuthModal.module.scss";

interface PasswordInputProps {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {!visible && <path d="M4 4 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" />}
  </svg>
);

const PasswordInput = ({ name, value, label, placeholder, autoComplete, onChange }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <label className={styles.field}>
      <span className={styles.field__label}>{label}</span>
      <div className={styles.field__passwordWrap}>
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={styles.field__input}
          required
        />
        <button
          type="button"
          className={styles.field__eye}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </label>
  );
};

export default PasswordInput;
