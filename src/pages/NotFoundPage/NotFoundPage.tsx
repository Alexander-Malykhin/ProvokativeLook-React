//styles
import styles from './NotFoundPage.module.scss'
//blocks
import NotFound from "@components/blocks/NotFound/NotFound.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import RunningLine from "@components/RunningLine/RunningLine.tsx";

const NotFoundPage = () => {
    return (
        <>
            <RunningLine/>
            <main className={styles.page__main}>
                <NotFound/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default NotFoundPage;