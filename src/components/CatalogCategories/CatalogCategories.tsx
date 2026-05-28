import styles from './CatalogCategories.module.scss';

import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import CatalogCategoryCard from '@components/CatalogCategories/components/CatalogCategoryCard/CatalogCategoryCard.tsx';

import type { CatalogCategoriesInterface } from '@components/CatalogCategories/types/types.ts';
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

const CatalogCategories = ({ cards, variant = 'promo' }: CatalogCategoriesInterface) => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={`${styles.category} ${styles[`category_${variant}`]}`}>
                {cards.map((item) => (
                    <CatalogCategoryCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        path={item.path}
                        image={item.image}
                        variant={variant}
                        buttonText={item.buttonText}
                    />
                ))}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default CatalogCategories;