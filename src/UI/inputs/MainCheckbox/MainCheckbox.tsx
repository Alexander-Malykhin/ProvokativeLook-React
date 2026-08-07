import type { ChangeEvent } from "react";

import styles from "./MainCheckbox.module.scss";
import type { MainCheckboxInterface } from "./types/types";

const MainCheckbox = ({
  children,
  onChange,
  register,
  ...inputProps
}: MainCheckboxInterface) => {
  const { onChange: registerOnChange, ...registerProps } = register ?? {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void registerOnChange?.(event);
    onChange?.(event.target.checked);
  };

  return (
    <label className={styles.checkbox}>
      <input
        {...inputProps}
        {...registerProps}
        type="checkbox"
        onChange={handleChange}
        className={styles.checkbox__input}
      />
      <span className={styles.checkbox__box} />
      <span className={styles.checkbox__text}>{children}</span>
    </label>
  );
};

export default MainCheckbox;
