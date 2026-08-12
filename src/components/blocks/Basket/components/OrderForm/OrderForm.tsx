import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { useGetUserQuery } from "@store/api/user/userApi";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import styles from "./OrderForm.module.scss";
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import FormRow from "@components/blocks/Basket/UI/FormRow/FormRow.tsx";
import type { Cart } from "@store/api/cart/types";

interface OrderFormProps {
  cart?: Cart;
}

const formatMoney = (value: number, currency: string) => {
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);

  return currency === "RUB" ? `${formatted} ₽` : `${formatted} ${currency}`;
};

const OrderForm = ({ cart }: OrderFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: userData, isFetching: isUserFetching } = useGetUserQuery();
  const isAuthenticated = Boolean(userData?.success && userData.user);
  const { pathname } = useLocation();
  const pathOrder = pathname.split("/")[1] === "order";
  const quantity = Math.round(cart?.quantity ?? 0);
  const total = cart?.total ?? 0;
  const currency = cart?.currency ?? "RUB";
  const hasUnavailableItems = cart?.items.some((item) => !item.isAvailable) ?? false;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    navigate("/order");
  };

  return (
    <div className={styles.form}>
      <div className={styles.form__header}>
        <FormRow
          mode="description"
          label="Ваша корзина"
          value={`${quantity} ${quantity === 1 ? "товар" : quantity >= 2 && quantity <= 4 ? "товара" : "товаров"}`}
        />

        <div className={styles.form__list}>
          <FormRow
            mode="price"
            label="Сумма:"
            value={formatMoney(total, currency)}
          />
        </div>
      </div>

      {!pathOrder && (
        <>
          <MainButton
            type="button"
            onClick={handleCheckout}
            disabled={hasUnavailableItems || isUserFetching}
          >
            Оформить заказ
          </MainButton>
          {hasUnavailableItems && (
            <p className={styles.form__stockError}>
              Проверьте наличие товаров перед оформлением
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default OrderForm;
