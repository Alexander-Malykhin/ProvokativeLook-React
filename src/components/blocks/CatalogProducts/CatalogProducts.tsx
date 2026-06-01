//styles
import styles from './CatalogProducts.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import CategoryNavigation from "@components/blocks/CatalogProducts/components/CategoryNavigation/CategoryNavigation.tsx";
import CategoryPagination from "@components/blocks/CatalogProducts/components/CategoryPagination/CategoryPagination.tsx";
import ListProducts from "@components/blocks/CatalogProducts/components/ListProducts/ListProducts.tsx";

const CatalogCategoryPage = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.category}>
                <div className={styles.category__content}>
                    <CategoryNavigation/>
                    <ListProducts/>
                </div>
                <div className={styles.category__footer}>
                    <CategoryPagination/>
                </div>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default CatalogCategoryPage