//styles
import styles from './CatalogCategoryPage.module.scss'
//blocks
import CatalogProducts from "@components/blocks/CatalogProducts/CatalogProducts.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const CatalogCategoryPage = () => {
    return (
        <>
            <Breadcrumbs />
            <main className={styles.page__main}>
                <CatalogProducts />
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default CatalogCategoryPage;