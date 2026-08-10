import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import styles from "./Order.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary";
import DeliveryStep from "./components/DeliveryStep/DeliveryStep";
import PaymentStep from "./components/PaymentStep/PaymentStep";
import RecipientStep from "./components/RecipientStep/RecipientStep";
import type { OrderFormValues } from "./model/types";
import { useGetCartQuery } from "@store/api/cart/cartApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { useGetAddressesQuery } from "@store/api/address/addressApi";
import { useCreateOrderMutation } from "@store/api/orders/ordersApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";

const Order = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery();
  const { data: addressesData, isLoading: isAddressesLoading } = useGetAddressesQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const initializedRef = useRef(false);

  const cart = cartData?.cart;
  const addresses = useMemo(() => addressesData?.addresses ?? [], [addressesData?.addresses]);
  const hasUnavailableItems = cart?.items.some((item) => !item.isAvailable) ?? false;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressId: "",
      delivery: "cdek",
      payment: "cash",
      privacy: false,
    },
  });

  useEffect(() => {
    if (initializedRef.current || !userData?.user || !addressesData) return;

    const defaultAddress = addresses.find((item) => item.isDefault) ?? addresses[0];
    reset({
      firstName: userData.user.firstName ?? "",
      lastName: userData.user.lastName ?? "",
      email: userData.user.email ?? "",
      phone: userData.user.phone ?? "",
      addressId: defaultAddress ? String(defaultAddress.id) : "",
      delivery: "cdek",
      payment: "cash",
      privacy: false,
    });
    initializedRef.current = true;
  }, [addresses, addressesData, reset, userData?.user]);

  const selectedAddressId = watch("addressId");

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage("");

    if (!cart || cart.items.length === 0) {
      setErrorMessage("Корзина пуста");
      return;
    }

    if (hasUnavailableItems) {
      setErrorMessage("В корзине есть товар, которого уже нет в нужном количестве");
      return;
    }

    if (!values.addressId) {
      setErrorMessage("Выберите адрес доставки");
      return;
    }

    try {
      const response = await createOrder({
        recipient: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
        addressId: Number(values.addressId),
        delivery: values.delivery,
        payment: values.payment,
        privacy: values.privacy,
      }).unwrap();

      navigate(`/profile/orders?created=${response.order.orderId}`);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "Не удалось оформить заказ"));
    }
  });

  if (isCartLoading || isUserLoading || isAddressesLoading) {
    return (
      <SectionLayout>
        <MainLayoutContainer>
          <div className={styles.order__loading}>Загрузка данных заказа...</div>
        </MainLayoutContainer>
      </SectionLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <SectionLayout>
        <MainLayoutContainer>
          <div className={styles.order__empty}>
            <h2>Корзина пуста</h2>
            <button type="button" onClick={() => navigate("/catalog/all")}>Перейти в каталог</button>
          </div>
        </MainLayoutContainer>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <form onSubmit={onSubmit}>
        <MainLayoutContainer className={styles.order}>
          <div className={styles.order__list}>
            {hasUnavailableItems && (
              <div className={styles.order__stockWarning}>
                В корзине есть позиции, которых недостаточно на складе. Измените количество или удалите их перед оформлением.
              </div>
            )}

            <RecipientStep register={register} errors={errors} />
            <DeliveryStep
              register={register}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
            />
            <PaymentStep
              register={register}
              errors={errors}
              isSubmitting={isCreating}
              errorMessage={errorMessage}
            />
          </div>
          <OrderSummary cart={cart} />
        </MainLayoutContainer>
      </form>
    </SectionLayout>
  );
};

export default Order;
