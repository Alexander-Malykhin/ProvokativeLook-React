//styles
import styles from './OrderSummary.module.scss'
//components
import OrderForm from "@components/blocks/Basket/components/OrderForm/OrderForm.tsx";
import OrderBonuses from "@components/blocks/Basket/components/OrderBonuses/OrderBonuses.tsx";

const OrderSummary = () => {
    return (
        <div className={styles.order}>
            <OrderForm/>
            <OrderBonuses/>
        </div>
    );
};

export default OrderSummary;