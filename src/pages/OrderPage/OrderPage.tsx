//styles
import styles from './OrderPage.module.scss'
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import Order from "@components/blocks/Order/Order.tsx";

const OrderPage = () => {
    return (
        <>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Order/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default OrderPage;