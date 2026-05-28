//styles
import styles from './Catalog.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
//import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Category from "@components/blocks/Category/Category.tsx";
//components
import RunningLine from "@components/RunningLine/RunningLine.tsx";
//import Footer from "@components/blocks/Footer/Footer.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const CatalogPage = () => {
    return (
        <>
            <Header/>
            <RunningLine text={'Доставка по России 300 ₽'}/>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Category/>
                <Reviews/>
                <AnswersToQuestions/>
                {/*<SubscribeNewsLetter/>*/}
            </main>
            {/*<Footer/>*/}
        </>
    );
};

export default CatalogPage;