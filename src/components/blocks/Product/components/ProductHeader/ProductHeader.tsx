import styles from "./ProductHeader.module.scss";
interface ProductHeaderProps {
    article: string | null;
    title: string;
}
const ProductHeader = ({ article, title }: ProductHeaderProps) => {
    return (<div className={styles.header}>
      <h1 className={styles.header__title}>{title}</h1>

      {article && <span className={styles.header__articul}>Арт. {article}</span>}
    </div>);
};
export default ProductHeader;
