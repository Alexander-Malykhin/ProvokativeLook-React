import styles from "./OrderSummary.module.scss";
import OrderForm from "@components/blocks/Basket/components/OrderForm/OrderForm.tsx";
import type { Cart } from "@store/api/cart/types";
interface OrderSummaryProps {
    cart?: Cart;
    disabled?: boolean;
}
const OrderSummary = ({ cart, disabled }: OrderSummaryProps) => (<div className={styles.order}>
    <OrderForm cart={cart} disabled={disabled}/>
  </div>);
export default OrderSummary;

