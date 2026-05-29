//styles
import styles from './BasketActions.module.scss'
//images
import DeleteImage from "@assets/basket/delete.svg";
import FavoritesImage from "@assets/basket/favorites.svg";
//UI
import Image from "@UI/buttons/Image/Image.tsx";

const BasketActions = () => {
    return (
        <div className={styles.actions}>
            <button className={styles.actions__button}>
                <Image src={FavoritesImage} alt="favorites-icon"/>
            </button>

            <button className={styles.actions__button}>
                <Image src={DeleteImage} alt="delete-icon"/>
            </button>
        </div>
    );
};

export default BasketActions;