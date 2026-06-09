import styles from './ProductBreadCrumbs.module.scss'
import {Link} from "react-router-dom";

const ProductBreadCrumbs = () => {
    return (
        <nav className={styles.navigation}>
            <Link to="/" className={styles.navigation__link}>Главная</Link>
            <span className={styles.navigation__slash}>\</span>
            <Link to="/catalog" className={styles.navigation__link}>Каталог</Link>
            <span className={styles.navigation__slash}>\</span>
            <Link to="/catalog/clothes" className={styles.navigation__link}>Одежда</Link>
            <span className={styles.navigation__slash}>\</span>
            <Link to="/catalog/sweaters-cardigans" className={styles.navigation__link}>
                Джемперы, свитеры, кардиганы
            </Link>
            <span className={styles.navigation__slash}>\</span>
            <span className={styles.navigation__link}>Кардиганы</span>
        </nav>
    );
};

export default ProductBreadCrumbs;