import { useId, type HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import styles from "./OrderFieldInput.module.scss";

interface OrderFieldInputProps {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

const OrderFieldInput = ({
  label,
  type = "text",
  placeholder,
  error,
  register,
}: OrderFieldInputProps) => {
  const inputId = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.field__label}>
        {label}
      </label>
      <input
        {...register}
        id={inputId}
        type={type}
        className={styles.field__input}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <span className={styles.field__error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default OrderFieldInput;
