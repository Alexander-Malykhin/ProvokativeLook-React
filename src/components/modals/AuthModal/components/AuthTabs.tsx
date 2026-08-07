import type { AuthModalMode } from "@store/slices/toggleAuthModalSlice";
import styles from "../AuthModal.module.scss";

interface AuthTabsProps {
  mode: AuthModalMode;
  disabled: boolean;
  onChange: (mode: AuthModalMode) => void;
}

const AuthTabs = ({ mode, disabled, onChange }: AuthTabsProps) => (
  <div className={styles.modal__tabs} role="tablist">
    {(["login", "register"] as const).map((tab) => (
      <button
        key={tab}
        type="button"
        role="tab"
        aria-selected={mode === tab}
        disabled={disabled}
        onClick={() => onChange(tab)}
        className={`${styles.modal__tab} ${
          mode === tab ? styles.modal__tab_active : ""
        }`}
      >
        {tab === "login" ? "Вход" : "Регистрация"}
      </button>
    ))}
  </div>
);

export default AuthTabs;
