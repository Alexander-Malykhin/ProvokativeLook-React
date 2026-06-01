//styles
import styles from './BasketPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import Basket from "@components/blocks/Basket/Basket.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";

const BasketPage = () => {
    return (
        <>
            <Header/>
            <RunningLine/>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Basket/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default BasketPage;