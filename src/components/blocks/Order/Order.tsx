import { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "./Order.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary";
import DeliveryStep from "./components/DeliveryStep/DeliveryStep";
import PaymentStep from "./components/PaymentStep/PaymentStep";
import RecipientStep from "./components/RecipientStep/RecipientStep";
import type { OrderFormValues } from "./model/types";

const Order = () => {
  const [isPrepared, setIsPrepared] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      delivery: "cdek",
      payment: "cash",
      privacy: false,
    },
  });

  return (
    <SectionLayout>
      <form
        onSubmit={handleSubmit(() => {
          // The create-order mutation can be connected here.
          setIsPrepared(true);
        })}
      >
        <MainLayoutContainer className={styles.order}>
          <div className={styles.order__list}>
            <RecipientStep register={register} errors={errors} />
            <DeliveryStep register={register} />
            <PaymentStep
              register={register}
              errors={errors}
              isPrepared={isPrepared}
            />
          </div>
          <OrderSummary />
        </MainLayoutContainer>
      </form>
    </SectionLayout>
  );
};

export default Order;
