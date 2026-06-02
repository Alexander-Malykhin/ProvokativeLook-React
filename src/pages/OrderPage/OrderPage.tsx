//styles
import styles from './OrderPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import Order from "@components/blocks/Order/Order.tsx";

const OrderPage = () => {
    return (
        <>
            <Header/>
            <RunningLine/>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Order/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default OrderPage;