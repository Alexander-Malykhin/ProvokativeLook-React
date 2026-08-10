import { useParams } from "react-router-dom";
import styles from "./ViewedProducts.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import ViewedSlider from "./components/ViewedSlider/ViewedSlider";
import ViewedColumn from "./components/ViewedColumn/ViewedColumn";
import { useCarousel } from "@hooks/useCarousel";
import { useGetRecentlyViewedQuery } from "@store/api/recentlyViewed/recentlyViewedApi";
import { catalogProductToListItem } from "@store/api/catalog/format";

const ViewedProducts = () => {
  const { id } = useParams<{ id: string }>();
  const currentProductId = Number(id);

  const { data, isLoading, isFetching } = useGetRecentlyViewedQuery({
    limit: 12,
    excludeId:
      Number.isInteger(currentProductId) && currentProductId > 0
        ? currentProductId
        : undefined,
  });

  const products = (data?.items ?? []).map(catalogProductToListItem);
  const carousel = useCarousel({ itemCount: products.length });

  if (isLoading) {
    return (
      <SectionLayout>
        <MainLayoutContainer className={styles.view}>
          <div className={styles.columnSkeleton} />
          <div className={styles.listSkeleton}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.cardSkeleton} />
            ))}
          </div>
        </MainLayoutContainer>
      </SectionLayout>
    );
  }

  if (products.length === 0) return null;

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.view}>
        <ViewedColumn onPrev={carousel.showPrevious} onNext={carousel.showNext} />

        <div className={styles.sliderWrap}>
          {isFetching && <span className={styles.progress} aria-hidden="true" />}
          <ViewedSlider sliderRef={carousel.sliderRef} products={products} visibleProducts={products} />
        </div>
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default ViewedProducts;
