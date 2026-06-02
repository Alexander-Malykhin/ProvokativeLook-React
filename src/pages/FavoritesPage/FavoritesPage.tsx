//styles
import styles from './FavoritesPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import Favorites from "@components/blocks/Favorites/Favorites.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";

const FavoritesPage = () => {
    return (
        <>
            <Header/>
            <RunningLine/>
            <Breadcrumbs title={'Связаться с нами'}/>
            <main className={styles.page__main}>
                <Favorites/>
                <Reviews/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default FavoritesPage;