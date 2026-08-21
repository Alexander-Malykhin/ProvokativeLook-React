import styles from "./CatalogCategories.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import CatalogCategoryCard from "@components/CatalogCategories/components/CatalogCategoryCard/CatalogCategoryCard.tsx";
import CatalogCategoriesSkeleton from "@components/CatalogCategories/components/CatalogCategoriesSkeleton/CatalogCategoriesSkeleton.tsx";
import type { CatalogCategoriesInterface } from "@components/CatalogCategories/types/types.ts";
const CatalogCategories = ({ cards, variant = "promo", isLoading = false, }: CatalogCategoriesInterface) => {
    return (<SectionLayout>
      <MainLayoutContainer className={`${styles.category} ${styles[`category_${variant}`]}`}>
        {isLoading ? (<CatalogCategoriesSkeleton />) : (cards.map((item, index) => (<CatalogCategoryCard key={`${item.path}-${item.id ?? index}`} id={item.id ?? index + 1} title={item.title} path={item.path} image={item.image} variant={variant} buttonText={item.buttonText}/>)))}
      </MainLayoutContainer>
    </SectionLayout>);
};
export default CatalogCategories;

