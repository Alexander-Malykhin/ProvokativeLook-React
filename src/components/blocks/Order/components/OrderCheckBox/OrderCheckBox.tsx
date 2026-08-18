import type { ChangeEvent } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Link } from "react-router-dom";

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
        <Link
          to="/personal-data-consent"
          className={styles.checkbox__link}
          onClick={(event) => event.stopPropagation()}
        >
          персональных данных
        </Link>{" "}
        в соответствии с{" "}
        <Link
          to="/privacy-policy"
          className={styles.checkbox__link}
          onClick={(event) => event.stopPropagation()}
        >
          политикой конфиденциальности
        </Link>
      </span>
    </label>
  );
};

export default OrderCheckBox;
