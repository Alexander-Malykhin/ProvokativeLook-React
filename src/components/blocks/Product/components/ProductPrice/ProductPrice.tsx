import styles from "./ProductPrice.module.scss";

interface ProductPriceProps {
  price: string;
}

const ProductPrice = ({ price }: ProductPriceProps) => (
  <div className={styles.price}>
    <span className={styles.price__main}>{price}</span>
  </div>
);

export default ProductPrice;
