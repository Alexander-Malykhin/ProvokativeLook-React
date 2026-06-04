//styles
import styles from './HomePage.module.scss';
//blocks
import Banner from "@components/blocks/Banner/Banner.tsx";
import CategoryPromo from "@components/blocks/CategoryPromo/CategoryPromo.tsx";
import News from "@components/blocks/News/News.tsx";
import CatalogPromo from "@components/blocks/CatalogPromo/CatalogPromo.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Bestsellers from "@components/blocks/Bestsellers/Bestsellers.tsx";
import ViewedProducts from "@components/blocks/ViewedProducts/ViewedProducts.tsx";


const HomePage = () => {

    return (
        <>
            <main className={styles.page__main}>
                <Banner/>
                <Bestsellers/>
                <CategoryPromo/>
                <News/>
                <CatalogPromo/>
                <ViewedProducts/>
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default HomePage;