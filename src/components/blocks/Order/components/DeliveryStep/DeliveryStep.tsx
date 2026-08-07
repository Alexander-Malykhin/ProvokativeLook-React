import type { UseFormRegister } from "react-hook-form";

import styles from "../../Order.module.scss";
import type { OrderFormValues } from "../../model/types";
import OrderFieldRadio from "../OrderFieldRadio/OrderFieldRadio";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";

interface DeliveryStepProps {
  register: UseFormRegister<OrderFormValues>;
}

const DeliveryStep = ({ register }: DeliveryStepProps) => (
  <OrderStepContainer title="2. Доставка" mode="radio">
    <OrderFieldRadio
      name="delivery"
      value="cdek"
      mode="dynamic"
      register={register("delivery", { required: true })}
    >
      <span className={styles.order__title}>В пункт выдачи CDEK</span>
      <span className={styles.order__address}>
        Ростов-на-Дону, переулок Халтуринский, 159/63 #SRND55
      </span>
      <span className={styles.order__description}>14 марта</span>
      <span className={styles.order__description}>560 рублей</span>
    </OrderFieldRadio>
    <OrderFieldRadio
      name="delivery"
      value="mail"
      mode="dynamic"
      register={register("delivery")}
    >
      <span className={styles.order__title}>В отделение Почты России</span>
      <span className={styles.order__address}>
        Ростов-на-Дону, пер. Братский, 55 #SRND201
      </span>
      <span className={styles.order__description}>14 марта</span>
      <span className={styles.order__description}>560 рублей</span>
    </OrderFieldRadio>

    <div className={styles.order__information}>
      <button type="button" className={styles.button}>
        <span className={styles.button__icon}>
          <span className={styles.button__icon_line} />
          <span className={styles.button__icon_line} />
        </span>
        Добавить новый адрес
      </button>
      <div className={styles.price}>
        <div className={styles.price__item}>
          <h2 className={styles.price__item_title}>Дата доставки</h2>
          <span className={styles.price__item_text}>14 марта</span>
        </div>
        <div className={styles.price__item}>
          <h2 className={styles.price__item_title}>Стоимость</h2>
          <span className={styles.price__item_text}>560 рублей</span>
        </div>
      </div>
    </div>
  </OrderStepContainer>
);

export default DeliveryStep;
