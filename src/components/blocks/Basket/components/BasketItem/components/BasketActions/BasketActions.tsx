import styles from "./BasketActions.module.scss";
import DeleteImage from "@assets/basket/delete.svg";
import FavoritesImage from "@assets/basket/favorites.svg";
import Image from "@UI/media/Image/Image";

interface BasketActionsProps {
  onDelete?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  disabled?: boolean;
}

const BasketActions = ({
  onDelete,
  onFavorite,
  isFavorite = false,
  disabled = false,
}: BasketActionsProps) => (
  <div className={styles.actions}>
    <button
      type="button"
      className={`${styles.actions__button} ${isFavorite ? styles.actions__button_active : ""}`}
      onClick={onFavorite}
      disabled={disabled}
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Image src={FavoritesImage} alt="" />
    </button>

    <button
      type="button"
      className={styles.actions__button}
      onClick={onDelete}
      disabled={disabled}
      aria-label="Удалить товар"
    >
      <Image src={DeleteImage} alt="" />
    </button>
  </div>
);

export default BasketActions;
