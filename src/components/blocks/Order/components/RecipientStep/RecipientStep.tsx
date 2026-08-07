import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { OrderFormValues } from "../../model/types";
import OrderFieldInput from "../OrderFieldInput/OrderFieldInput";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";

interface RecipientStepProps {
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
}

const RecipientStep = ({ register, errors }: RecipientStepProps) => (
  <OrderStepContainer title="1. Данные получателя" mode="fields">
    <OrderFieldInput
      label="Имя*"
      placeholder="Алиса"
      register={register("firstName", { required: "Введите имя" })}
      error={errors.firstName?.message}
    />
    <OrderFieldInput
      label="Фамилия*"
      placeholder="Иванова"
      register={register("lastName", { required: "Введите фамилию" })}
      error={errors.lastName?.message}
    />
    <OrderFieldInput
      label="Электронная почта*"
      placeholder="mail@example.ru"
      type="email"
      register={register("email", {
        required: "Введите электронную почту",
      })}
      error={errors.email?.message}
    />
    <OrderFieldInput
      label="Телефон*"
      placeholder="+7 (999) 999-99-99"
      type="tel"
      register={register("phone", { required: "Введите телефон" })}
      error={errors.phone?.message}
    />
  </OrderStepContainer>
);

export default RecipientStep;
