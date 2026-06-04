//styles
import styles from './FavoritesPage.module.scss'
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import Favorites from "@components/blocks/Favorites/Favorites.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const FavoritesPage = () => {
    return (
        <>
            <Breadcrumbs title={'Связаться с нами'}/>
            <main className={styles.page__main}>
                <Favorites/>
                <Reviews/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default FavoritesPage;