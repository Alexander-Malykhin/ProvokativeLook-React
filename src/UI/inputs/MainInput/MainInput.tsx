import type { ChangeEvent } from "react";

import styles from "./MainInput.module.scss";
import type { MainInputInterface } from "./types/types";

const MainInput = ({
  className = "",
  register,
  error,
  onChange,
  ...inputProps
}: MainInputInterface) => {
  const { onChange: registerOnChange, ...registerProps } = register ?? {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void registerOnChange?.(event);
    onChange?.(event);
  };

  return (
    <label className={styles.field}>
      <input
        {...inputProps}
        {...registerProps}
        className={`${styles.field__input} ${
          error ? styles.field__input_error : ""
        } ${className}`.trim()}
        onChange={handleChange}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <span className={styles.field__error} role="alert">
          {error}
        </span>
      )}
    </label>
  );
};

export default MainInput;
