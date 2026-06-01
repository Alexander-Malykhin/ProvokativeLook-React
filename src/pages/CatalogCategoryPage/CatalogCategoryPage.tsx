//styles
import styles from './CatalogCategoryPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import CatalogProducts from "@components/blocks/CatalogProducts/CatalogProducts.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const CatalogCategoryPage = () => {
    return (
        <>
            <Header />
            <RunningLine />
            <Breadcrumbs />
            <main className={styles.page__main}>
                <CatalogProducts />
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
            <Footer />
        </>
    );
};

export default CatalogCategoryPage;