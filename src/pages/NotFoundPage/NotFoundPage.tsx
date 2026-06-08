//styles
import styles from './NotFoundPage.module.scss'
//blocks
import NotFound from "@components/blocks/NotFound/NotFound.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";


const NotFoundPage = () => {
    return (
        <>
            <main className={styles.page__main}>
                <NotFound/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default NotFoundPage;