import { useMemo, useState } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";

import styles from "../../Order.module.scss";
import type { OrderFormValues } from "../../model/types";
import OrderFieldRadio from "../OrderFieldRadio/OrderFieldRadio";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";
import AddressModal from "@components/blocks/Profile/subpages/ProfileAddresses/components/AddressModal/AddressModal";
import type { ProfileAddress } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { useAddAddressMutation } from "@store/api/address/addressApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";

interface DeliveryStepProps {
  register: UseFormRegister<OrderFormValues>;
  setValue: UseFormSetValue<OrderFormValues>;
  addresses: ProfileAddress[];
  city: string;
  country: string;
  countryCode: string;
  onAddressSaved?: (address: ProfileAddress) => void;
}

const getProviderLabel = (address: ProfileAddress) =>
  address.deliveryProvider === "cdek" ? "СДЭК" : "Почта России";

const DeliveryStep = ({
  register,
  setValue,
  addresses,
  city,
  country,
  countryCode,
  onAddressSaved,
}: DeliveryStepProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addAddress, addState] = useAddAddressMutation();

  const deliveryAddresses = useMemo(
    () =>
      addresses.filter(
        (address) =>
          address.deliveryProvider === "cdek" || address.deliveryProvider === "mail",
      ),
    [addresses],
  );

  const saveAddress = (address: ProfileAddress) => {
    setErrorMessage("");

    void addAddress(address)
      .unwrap()
      .then((response) => {
        const saved = response.address;
        if (!saved) {
          throw new Error("API не вернул сохранённый адрес");
        }

        setValue("addressId", String(saved.id), {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        onAddressSaved?.(saved);
        setIsAddressModalOpen(false);
      })
      .catch((error) => {
        setErrorMessage(getRequestErrorMessage(error, "Не удалось сохранить адрес"));
      });
  };

  return (
    <OrderStepContainer title="2. Доставка" mode="radio">
      <div className={styles.order__addresses}>
        {deliveryAddresses.length > 0 ? (
          deliveryAddresses.map((address) => (
            <OrderFieldRadio
              key={address.id}
              name="addressId"
              value={String(address.id)}
              register={register("addressId", { required: true })}
            >
              <span className={styles.order__addressChoice}>
                <span className={styles.order__pickupService}>
                  {getProviderLabel(address)}
                  {address.pickupName ? ` — ${address.pickupName}` : ""}
                </span>
                <span>{address.formattedAddress}</span>
                {address.pickupCode && !/^(node|way|relation|fallback)-/i.test(address.pickupCode) && (
                  <span className={styles.order__pickupCode}>#{address.pickupCode}</span>
                )}
              </span>
            </OrderFieldRadio>
          ))
        ) : (
          <p className={styles.order__emptyDeliveryPoint}>
            У вас пока нет сохранённых пунктов СДЭК или Почты России.
          </p>
        )}
      </div>

      <div className={styles.order__information}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setIsAddressModalOpen(true)}
        >
          <span className={styles.button__icon}>
            <span className={styles.button__icon_line} />
            <span className={styles.button__icon_line} />
          </span>
          Добавить новый адрес
        </button>
      </div>

      {errorMessage && <p className={styles.order__error}>{errorMessage}</p>}

      <AddressModal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={saveAddress}
        city={city}
        country={country}
        countryCode={countryCode}
        isSaving={addState.isLoading}
      />
    </OrderStepContainer>
  );
};

export default DeliveryStep;
