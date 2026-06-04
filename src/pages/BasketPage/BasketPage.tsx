//styles
import styles from './BasketPage.module.scss'
//blocks
import Basket from "@components/blocks/Basket/Basket.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const BasketPage = () => {
    return (
        <>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Basket/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default BasketPage;