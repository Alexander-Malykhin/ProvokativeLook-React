import Image from "@UI/media/Image/Image";
import styles from "./ProductCard.module.scss";
import ProductCardSizes from "./components/ProductCardSizes";
import type { ProductListItem } from "@/types/product";

export type ProductCardProps = Omit<ProductListItem, "id">;

const ProductCard = ({ image, title, price, sizes }: ProductCardProps) => (
  <article className={styles.card}>
    <div className={styles.card__header}>
      <Image src={image} alt={title} className={styles.card__image} />
    </div>
    <div className={styles.card__body}>
      <div className={styles.card__information}>
        <h2 className={styles.card__information_title}>{title}</h2>
        <ProductCardSizes sizes={sizes} />
      </div>
      <span className={styles.card__price}>{price}</span>
    </div>
  </article>
);

export default ProductCard;
