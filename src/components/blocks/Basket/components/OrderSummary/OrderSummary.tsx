import styles from "./OrderSummary.module.scss";
import OrderForm from "@components/blocks/Basket/components/OrderForm/OrderForm.tsx";
import type { Cart } from "@store/api/cart/types";

interface OrderSummaryProps {
  cart?: Cart;
}

const OrderSummary = ({ cart }: OrderSummaryProps) => (
  <div className={styles.order}>
    <OrderForm cart={cart} />
  </div>
);

export default OrderSummary;
