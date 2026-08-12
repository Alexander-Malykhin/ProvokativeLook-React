import type { FieldErrors, UseFormRegister } from "react-hook-form";

import MainButton from "@UI/buttons/MainButton/MainButton";
import styles from "../../Order.module.scss";
import type { OrderFormValues } from "../../model/types";
import OrderCheckBox from "../OrderCheckBox/OrderCheckBox";
import OrderFieldRadio from "../OrderFieldRadio/OrderFieldRadio";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";

interface PaymentStepProps {
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
  isSubmitting: boolean;
  errorMessage?: string;
}

const PaymentStep = ({ register, errors, isSubmitting, errorMessage }: PaymentStepProps) => (
  <OrderStepContainer title="3. Оплата" mode="radio">
    <OrderFieldRadio
      name="payment"
      value="card"
      register={register("payment", { required: true })}
    >
      Оплата банковской картой
    </OrderFieldRadio>

    <div className={styles.order__footer}>
      <MainButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Оформляем..." : "Оформить заказ"}
      </MainButton>

      <OrderCheckBox
        register={register("privacy", {
          required: "Подтвердите согласие на обработку данных",
        })}
      />

      {errors.privacy && (
        <p className={styles.order__error} role="alert">
          {errors.privacy.message}
        </p>
      )}

      {errorMessage && (
        <p className={styles.order__error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  </OrderStepContainer>
);

export default PaymentStep;
