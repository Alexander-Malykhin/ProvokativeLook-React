import styles from "./ProductCardSizes.module.scss";

interface ProductCardSizesProps {
  sizes: string[];
}

const ProductCardSizes = ({ sizes }: ProductCardSizesProps) => (
  <div className={styles.sizes}>
    {sizes.map((size) => (
      <span className={styles.sizes__item} key={size}>
        {size}
      </span>
    ))}
  </div>
);

export default ProductCardSizes;
