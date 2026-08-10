import { Link } from "react-router-dom";
import Image from "@UI/media/Image/Image";
import styles from "./ProductCard.module.scss";
import ProductCardSizes from "./components/ProductCardSizes";
import type { ProductListItem } from "@/types/product";

export type ProductCardProps = ProductListItem;

const ProductCard = ({ id, image, title, price, sizes }: ProductCardProps) => (
  <article className={styles.card}>
    <Link
      to={`/product/${id}`}
      className={styles.card__header}
      aria-label={`Открыть товар ${title}`}
    >
      {image ? (
        <Image src={image} alt={title} className={styles.card__image} />
      ) : (
        <div className={styles.card__placeholder} aria-label="Фотография товара отсутствует">
          <span className={styles.card__placeholderIcon} aria-hidden="true">▧</span>
          <span>Фото скоро появится</span>
        </div>
      )}
    </Link>

    <div className={styles.card__body}>
      <div className={styles.card__information}>
        <Link to={`/product/${id}`} className={styles.card__information_title}>
          {title}
        </Link>
        <ProductCardSizes sizes={sizes} />
      </div>
      <span className={styles.card__price}>{price}</span>
    </div>
  </article>
);

export default ProductCard;
