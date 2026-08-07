import styles from "./SwitchInput.module.scss";
import type { SwitchInputInterface } from "./types/types";

const SwitchInput = ({
  checked,
  onChange,
  disabled,
  label = "Переключатель",
}: SwitchInputInterface) => (
  <label className={styles.switch} aria-label={label}>
    <input
      type="checkbox"
      className={styles.switch__input}
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.checked)}
    />
    <span className={styles.switch__slider} />
  </label>
);

export default SwitchInput;
