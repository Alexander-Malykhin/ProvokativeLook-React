import { useNavigate } from "react-router-dom";
import type { UseFormRegister } from "react-hook-form";

import styles from "../../Order.module.scss";
import type { OrderFormValues } from "../../model/types";
import OrderFieldRadio from "../OrderFieldRadio/OrderFieldRadio";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";
import type { ProfileAddress } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";

interface DeliveryStepProps {
  register: UseFormRegister<OrderFormValues>;
  addresses: ProfileAddress[];
  selectedAddressId: string;
}

const DeliveryStep = ({ register, addresses, selectedAddressId }: DeliveryStepProps) => {
  const navigate = useNavigate();
  const selectedAddress = addresses.find((item) => String(item.id) === selectedAddressId)
    ?? addresses.find((item) => item.isDefault)
    ?? addresses[0];

  return (
    <OrderStepContainer title="2. Доставка" mode="radio">
      {addresses.length > 0 && (
        <div className={styles.order__addresses}>
          <h3 className={styles.order__subTitle}>Адрес доставки</h3>
          {addresses.map((address) => (
            <OrderFieldRadio
              key={address.id}
              name="addressId"
              value={String(address.id)}
              register={register("addressId", { required: true })}
            >
              <span className={styles.order__addressChoice}>
                {address.formattedAddress}
                {address.isDefault && (
                  <span className={styles.order__defaultBadge}>Основной адрес</span>
                )}
              </span>
            </OrderFieldRadio>
          ))}
        </div>
      )}

      <div className={styles.order__deliveryMethods}>
        <h3 className={styles.order__subTitle}>Способ доставки</h3>
        <OrderFieldRadio
          name="delivery"
          value="cdek"
          mode="dynamic"
          register={register("delivery", { required: true })}
        >
          <span className={styles.order__title}>СДЭК</span>
          <span className={styles.order__address}>
            {selectedAddress?.formattedAddress ?? "Сначала добавьте адрес доставки"}
          </span>
        </OrderFieldRadio>

        <OrderFieldRadio
          name="delivery"
          value="mail"
          mode="dynamic"
          register={register("delivery", { required: true })}
        >
          <span className={styles.order__title}>Почта России</span>
          <span className={styles.order__address}>
            {selectedAddress?.formattedAddress ?? "Сначала добавьте адрес доставки"}
          </span>
        </OrderFieldRadio>
      </div>

      <div className={styles.order__information}>
        <button
          type="button"
          className={styles.button}
          onClick={() => navigate("/profile/addresses")}
        >
          <span className={styles.button__icon}>
            <span className={styles.button__icon_line} />
            <span className={styles.button__icon_line} />
          </span>
          Добавить новый адрес
        </button>
      </div>
    </OrderStepContainer>
  );
};

export default DeliveryStep;
