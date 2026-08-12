import type { ChangeEvent } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import styles from "./OrderCheckBox.module.scss";

interface OrderCheckBoxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  register?: UseFormRegisterReturn;
}

const OrderCheckBox = ({ checked, onChange, register }: OrderCheckBoxProps) => {
  const { onChange: registerOnChange, ...registerProps } = register ?? {};
  const isControlled = typeof checked === "boolean";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void registerOnChange?.(event);
    onChange?.(event.target.checked);
  };

  return (
    <label className={styles.checkbox}>
      <span className={styles.checkbox__control}>
        <input
          {...registerProps}
          type="checkbox"
          {...(isControlled ? { checked } : {})}
          onChange={handleChange}
          className={styles.checkbox__input}
        />
        <span className={styles.checkbox__box} aria-hidden="true" />
      </span>

      <span className={styles.checkbox__content}>
        Соглашаюсь на обработку моих{" "}
        <span className={styles.checkbox__link}>персональных данных</span>{" "}
        в соответствии с{" "}
        <span className={styles.checkbox__link}>политикой конфиденциальности</span>
      </span>
    </label>
  );
};

export default OrderCheckBox;
