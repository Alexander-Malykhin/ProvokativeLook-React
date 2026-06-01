import { NavLink } from 'react-router-dom';
//styles
import styles from './CategoryNavigation.module.scss'

const categories = [
    { title: 'СМОТРЕТЬ ВСЁ', path: '/catalog' },
    { title: 'КОМБИНЕЗОНЫ И КОСТЮМЫ', path: '/catalog/kombinezony-i-kostyumy' },
    { title: 'ВЕРХНЯЯ ОДЕЖДА', path: '/catalog/verhnyaya-odezhda' },
    { title: 'ПЛАТЬЯ И САРАФАНЫ', path: '/catalog/platya-i-sarafany' },
    { title: 'ОБУВЬ', path: '/catalog/obuv' },
    { title: 'БЛУЗЫ И РУБАШКИ', path: '/catalog/bluzy-i-rubashki' },
    { title: 'БРЮКИ И ШОРТЫ', path: '/catalog/bryuki-i-shorty' },
    { title: 'КОМПЛЕКТЫ', path: '/catalog/komplekty' },
    { title: 'ТОПЫ И ФУТБОЛКИ', path: '/catalog/topy-i-futbolki' },
    { title: 'ЮБКИ', path: '/catalog/yubki' },
    { title: 'СВИТЕРЫ И КАРДИГАНЫ', path: '/catalog/svitery-i-kardigany' },
    { title: 'ТОЛСТОВКИ И ХУДИ', path: '/catalog/tolstovki-i-hudi' },
    { title: 'ДЖИНСЫ', path: '/catalog/dzhinsy' },
    { title: 'ЖАКЕТЫ', path: '/catalog/zhakety' },
    { title: 'АКСЕССУАРЫ', path: '/catalog/aksessuary' },
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