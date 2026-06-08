import { NavLink } from 'react-router-dom';
//styles
import styles from './CategoryNavigation.module.scss';

const categories = [
    { title: 'СМОТРЕТЬ ВСЁ', path: '/catalog' },
    { title: 'КОМБИНЕЗОНЫ И КОСТЮМЫ', path: '/catalog/costumes' },
    { title: 'ВЕРХНЯЯ ОДЕЖДА', path: '/catalog/outerwear' },
    { title: 'ПЛАТЬЯ И САРАФАНЫ', path: '/catalog/dresses' },
    { title: 'ОБУВЬ', path: '/catalog/shoes' },
    { title: 'БЛУЗЫ И РУБАШКИ', path: '/catalog/shirts' },
    { title: 'БРЮКИ И ШОРТЫ', path: '/catalog/shorts' },
    { title: 'КОМПЛЕКТЫ', path: '/catalog/sets' },
    { title: 'ТОПЫ И ФУТБОЛКИ', path: '/catalog/tops' },
    { title: 'ЮБКИ', path: '/catalog/skirts' },
    { title: 'СВИТЕРЫ И КАРДИГАНЫ', path: '/catalog/sweaters' },
    { title: 'ТОЛСТОВКИ И ХУДИ', path: '/catalog/hoodie' },
    { title: 'ДЖИНСЫ', path: '/catalog/jeans' },
    { title: 'ЖАКЕТЫ', path: '/catalog/jackets' },
    { title: 'АКСЕССУАРЫ', path: '/catalog/accessories' },
];

const catalogTags = [
    { title: 'ХИТЫ ПРОДАЖ', path: '/catalog/hity-prodazh' },
    { title: 'РАСПРОДАЖА', path: '/catalog/rasprodazha', sale: true },
];

const CategoryNavigation = () => {
    return (
        <nav className={styles.navigation}>
            <div className={styles.navigation__list}>
                {categories.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/catalog'}
                        className={({ isActive }) =>
                            `${styles.navigation__item} ${
                                isActive ? styles.navigation__item_active : ''
                            }`
                        }
                    >
                        {item.title}
                    </NavLink>
                ))}
            </div>

            <div className={styles.navigation__list}>
                {catalogTags.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navigation__item} ${
                                item.sale ? styles.navigation__item_sale : ''
                            } ${isActive ? styles.navigation__item_active : ''}`
                        }
                    >
                        {item.title}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default CategoryNavigation;