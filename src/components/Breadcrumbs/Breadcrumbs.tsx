import {Fragment} from 'react';
import {useLocation, Link} from 'react-router-dom';
//styles
import styles from './Breadcrumbs.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';

const titles: Record<string, string> = {
    catalog: 'Каталог',
    contacts: 'Контакты',
    basket: 'Корзина'
};

interface BreadcrumbsInterface {
    title?:string
}

const Breadcrumbs = ({title}:BreadcrumbsInterface) => {
    const {pathname} = useLocation();

    const parts = pathname.split('/').filter(Boolean);

    const crumbs = parts.map((part, index) => {
        const path = '/' + parts.slice(0, index + 1).join('/');

        return {
            title: titles[part] || part,
            path,
        };
    });

    const currentPageTitle = crumbs.at(-1)?.title || 'Главная';

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

                <h1 className={styles.navigation__title}>
                    {title || currentPageTitle}
                </h1>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Breadcrumbs;