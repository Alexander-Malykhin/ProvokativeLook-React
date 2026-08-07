import type { ChangeEvent, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import styles from "./OrderFieldRadio.module.scss";

interface OrderRadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  register?: UseFormRegisterReturn;
  children?: ReactNode;
  mode?: "static" | "dynamic";
}

const OrderFieldRadio = ({
  name,
  value,
  checked,
  onChange,
  register,
  children,
  mode = "static",
}: OrderRadioProps) => {
  const {
    onChange: registerOnChange,
    name: registeredName,
    ...registerProps
  } = register ?? {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void registerOnChange?.(event);
    onChange?.(value);
  };

  return (
    <label className={styles.radio}>
      <input
        {...registerProps}
        type="radio"
        name={registeredName ?? name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={styles.radio__input}
      />
      <span className={styles.radio__dot} />
      {mode === "static" ? (
        <span className={styles.radio__text}>{children}</span>
      ) : (
        <span className={styles.radio__content}>{children}</span>
      )}
    </label>
  );
};

export default OrderFieldRadio;
