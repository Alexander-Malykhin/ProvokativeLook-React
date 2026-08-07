import styles from "./ProductHeader.module.scss";

interface ProductHeaderProps {
  id: number;
  title: string;
}

const ProductHeader = ({ id, title }: ProductHeaderProps) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.header__title}>{title}</h1>

      <span className={styles.header__articul}>
        Арт. {String(id).padStart(8, "0")}
      </span>
    </div>
  );
};

export default ProductHeader;
