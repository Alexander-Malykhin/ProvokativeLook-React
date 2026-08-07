// styles
import styles from "./CategoryPromo.module.scss";
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
// components
import CategoryPromoSkeleton from "@components/blocks/CategoryPromo/components/CategoryPromoSkeleton/CategoryPromoSkeleton";
import CategoryPromoItem from "@components/blocks/CategoryPromo/components/CategoryPromoItem/CategoryPromoItem";
// api
import { useGetHomeQuery } from "@store/api/home/homeApi";

const CategoryPromo = () => {
  const { data, isLoading, isError } = useGetHomeQuery();

  if (isLoading) return <CategoryPromoSkeleton />;

  if (isError || !data) return null;

  const promoItems = data.promoCategory
    .filter((item) => item.properties.CATEGORY_SHOW_PROMO === "Да")
    .reverse();

  if (promoItems.length === 0) {
    return null;
  }

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.promo}>
        {promoItems.map((item) => (
          <CategoryPromoItem key={item.id} item={item} />
        ))}
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default CategoryPromo;
