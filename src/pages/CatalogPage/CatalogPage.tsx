//styles
import styles from './Catalog.module.scss'
//blocks
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Category from "@components/blocks/Category/Category.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const CatalogPage = () => {
    return (
        <>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Category/>
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default CatalogPage;