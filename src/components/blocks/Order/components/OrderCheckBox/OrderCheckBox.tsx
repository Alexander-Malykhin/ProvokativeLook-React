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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void registerOnChange?.(event);
    onChange?.(event.target.checked);
  };

  return (
    <label className={styles.checkbox}>
      <input
        {...registerProps}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.checkbox__input}
      />
      <span className={styles.checkbox__box} />
      <span className={styles.checkbox__content}>
        Соглашаюсь на обработку моих{" "}
        <Link to="#" className={styles.checkbox__link}>
          персональных данных
        </Link>{" "}
        в соответствии с{" "}
        <Link to="#" className={styles.checkbox__link}>
          политикой конфиденциальности
        </Link>
      </span>
    </label>
  );
};

export default OrderCheckBox;
