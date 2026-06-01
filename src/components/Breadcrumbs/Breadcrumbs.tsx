import {Fragment} from 'react';
import {useLocation, Link, useParams} from 'react-router-dom';
//styles
import styles from './Breadcrumbs.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';
//types
import type {BreadcrumbsInterface} from "@components/Breadcrumbs/types/types.ts";

export const catalogCategories = [
    { slug: 'kombinezony-i-kostyumy', title: 'Комбинезоны и костюмы' },
    { slug: 'verhnyaya-odezhda', title: 'Верхняя одежда' },
    { slug: 'platya-i-sarafany', title: 'Платья и сарафаны' },
    { slug: 'obuv', title: 'Обувь' },
    { slug: 'bluzy-i-rubashki', title: 'Блузы и рубашки' },
    { slug: 'bryuki-i-shorty', title: 'Брюки и шорты' },
    { slug: 'komplekty', title: 'Комплекты' },
    { slug: 'topy-i-futbolki', title: 'Топы и футболки' },
    { slug: 'yubki', title: 'Юбки' },
    { slug: 'svitery-i-kardigany', title: 'Свитеры и кардиганы' },
    { slug: 'tolstovki-i-hudi', title: 'Толстовки и худи' },
    { slug: 'dzhinsy', title: 'Джинсы' },
    { slug: 'zhakety', title: 'Жакеты' },
    { slug: 'aksessuary', title: 'Аксессуары' },
];

export const catalogTags = [
    { slug: 'hity-prodazh', title: 'Хиты продаж' },
    { slug: 'rasprodazha', title: 'Распродажа' },
];

const baseTitles: Record<string, string> = {
    catalog: 'Каталог',
    contacts: 'Контакты',
    basket: 'Корзина',
};

const categoryTitles = Object.fromEntries(
    [...catalogCategories, ...catalogTags].map(({ slug, title }) => [slug, title])
);

export const titles: Record<string, string> = {
    ...baseTitles,
    ...categoryTitles,
};

const Breadcrumbs = ({title}:BreadcrumbsInterface) => {
    const {pathname} = useLocation();
    const { categorySlug } = useParams();

    const parts = pathname.split('/').filter(Boolean);

    const crumbs = parts.map((part, index) => {
        const path = '/' + parts.slice(0, index + 1).join('/');

        return {
            title: titles[part] || part,
            path,
        };
    });

    const currentPageTitle = crumbs.at(-1)?.title || 'Главная';

    const isCatalogCategory = catalogCategories.some(
        (category) => category.slug === categorySlug
    );

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.navigation}>
                <nav className={styles.navigation__list}>
                    <Link to="/" className={styles.navigation__item}>Главная</Link>

                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;

                        return (
                            <Fragment key={crumb.path}>
                                <span className={styles.navigation__item}>\</span>

                                {isLast ? (
                                    <span className={styles.navigation__item}>{crumb.title}</span>
                                ) : (
                                    <Link to={crumb.path} className={styles.navigation__item}>{crumb.title}</Link>
                                )}
                            </Fragment>
                        );
                    })}
                </nav>

                {!isCatalogCategory && (
                    <h1 className={styles.navigation__title}>
                        {title || currentPageTitle}
                    </h1>
                )}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Breadcrumbs;