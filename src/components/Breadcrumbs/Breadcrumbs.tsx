import { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
//styles
import styles from './Breadcrumbs.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';
//types
import type { BreadcrumbsInterface } from '@components/Breadcrumbs/types/types.ts';

export const catalogCategories = [
    { slug: 'costumes', title: 'Комбинезоны и костюмы' },
    { slug: 'outerwear', title: 'Верхняя одежда' },
    { slug: 'dresses', title: 'Платья и сарафаны' },
    { slug: 'shoes', title: 'Обувь' },
    { slug: 'shirts', title: 'Блузы и рубашки' },
    { slug: 'shorts', title: 'Брюки и шорты' },
    { slug: 'sets', title: 'Комплекты' },
    { slug: 'tops', title: 'Топы и футболки' },
    { slug: 'skirts', title: 'Юбки' },
    { slug: 'sweaters', title: 'Свитеры и кардиганы' },
    { slug: 'hoodie', title: 'Толстовки и худи' },
    { slug: 'jeans', title: 'Джинсы' },
    { slug: 'jackets', title: 'Жакеты' },
    { slug: 'accessories', title: 'Аксессуары' },
];

export const catalogTags = [
    { slug: 'hity-prodazh', title: 'Хиты продаж' },
    { slug: 'rasprodazha', title: 'Распродажа' },
];

export const baseTitles: Record<string, string> = {
    catalog: 'Каталог',
    contacts: 'Контакты',
    basket: 'Корзина',
    order: 'Оформление заказа',
};

export const infoPages = [
    { id: 1, url: 'delivery-payment', title: 'Доставка и оплата' },
    { id: 2, url: 'loyalty-program', title: 'Программа лояльности' },
    { id: 3, url: 'return-policy', title: 'Условия возврата' },
    { id: 4, url: 'gift-certificates', title: 'Подарочные сертификаты' },
];

const infoTitles = Object.fromEntries(
    infoPages.map(({ url, title }) => [url, title])
);

const categoryTitles = Object.fromEntries(
    [...catalogCategories, ...catalogTags].map(({ slug, title }) => [slug, title])
);

export const titles: Record<string, string> = {
    ...baseTitles,
    ...categoryTitles,
    ...infoTitles,
};

const Breadcrumbs = ({ title }: BreadcrumbsInterface) => {
    const { pathname } = useLocation();

    const parts = pathname.split('/').filter(Boolean);

    const crumbs = parts
        .map((part, index) => {
            const path = '/' + parts.slice(0, index + 1).join('/');

            return {
                title: titles[part] || part,
                path,
                hidden: part === 'info',
            };
        })
        .filter((crumb) => !crumb.hidden);

    const currentPageTitle = crumbs.at(-1)?.title || 'Главная';

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.navigation}>
                <nav className={styles.navigation__list}>
                    <Link to="/" className={styles.navigation__item}>
                        Главная
                    </Link>

                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;

                        return (
                            <Fragment key={crumb.path}>
                                <span className={styles.navigation__item}>\</span>

                                {isLast ? (
                                    <span className={styles.navigation__item}>
                                        {crumb.title}
                                    </span>
                                ) : (
                                    <Link to={crumb.path} className={styles.navigation__item}>
                                        {crumb.title}
                                    </Link>
                                )}
                            </Fragment>
                        );
                    })}
                </nav>

                <h1 className={styles.navigation__title}>
                    {title || currentPageTitle}
                </h1>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Breadcrumbs;