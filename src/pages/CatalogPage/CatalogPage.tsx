//styles
import styles from './Catalog.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//blocks
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Category from "@components/blocks/Category/Category.tsx";
//components
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const CatalogPage = () => {
    return (
        <>
            <Header/>
            <RunningLine/>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Category/>
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default CatalogPage;