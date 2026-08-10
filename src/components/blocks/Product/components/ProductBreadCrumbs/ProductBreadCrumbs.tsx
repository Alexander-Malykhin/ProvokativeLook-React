import styles from "./ProductBreadCrumbs.module.scss";
import { Link } from "react-router-dom";

interface ProductBreadCrumbsProps {
  title: string;
}

const ProductBreadCrumbs = ({ title }: ProductBreadCrumbsProps) => {
  return (
    <nav className={styles.navigation} aria-label="Хлебные крошки">
      <Link to="/" className={styles.navigation__link}>
        Главная
      </Link>
      <span className={styles.navigation__slash}>\</span>
      <Link to="/catalog" className={styles.navigation__link}>
        Каталог
      </Link>
      <span className={styles.navigation__slash}>\</span>
      <span className={styles.navigation__link}>{title}</span>
    </nav>
  );
};

export default ProductBreadCrumbs;
