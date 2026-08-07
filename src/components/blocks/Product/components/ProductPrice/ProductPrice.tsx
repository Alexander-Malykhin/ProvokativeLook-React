import styles from "./ProductPrice.module.scss";

interface ProductPriceProps {
  price: string;
}

const ProductPrice = ({ price }: ProductPriceProps) => {
  return (
    <div className={styles.price}>
      <span className={styles.price__main}>{price}</span>
      <span className={`${styles.price__main} ${styles.price__discount}`}>
        15 000 ₽
      </span>
    </div>
  );
};

export default ProductPrice;
