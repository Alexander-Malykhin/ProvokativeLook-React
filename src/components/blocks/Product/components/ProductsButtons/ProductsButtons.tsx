import styles from './ProductsButtons.module.scss'
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import FavoritesImage from "@assets/header/favorite.svg";

const ProductsButtons = () => {
    return (
        <div className={styles.buttons}>
            <MainButton>
                В корзину
            </MainButton>
            <MainButton alt={'favorites-icon'} type={'button'} icon={FavoritesImage} mode={'secondary'} color={'black'}>
                В избранное
            </MainButton>
        </div>
    );
};

export default ProductsButtons;