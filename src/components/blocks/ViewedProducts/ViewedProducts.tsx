import { useState } from "react";
// styles
import styles from "./ViewedProducts.module.scss";
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
// components
import ViewedSlider from "./components/ViewedSlider/ViewedSlider";
import CarouselHeader from "@components/Carousel/CarouselHeader";
// UI
import MainButton from "@UI/buttons/MainButton/MainButton";
// api
import { products } from "@api/static/products";
import { useCarousel } from "@hooks/useCarousel";

const ViewedProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const carousel = useCarousel({ itemCount: products.length });

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleShowMore = () => {
    setVisibleCount((previousCount) => previousCount + 4);
  };

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.view}>
        <CarouselHeader
          title="Вы смотрели"
          onPrevious={carousel.showPrevious}
          onNext={carousel.showNext}
          hideControlsAt="desktop"
        />

        <ViewedSlider
          sliderRef={carousel.sliderRef}
          products={products}
          visibleProducts={visibleProducts}
        />

        {hasMore && (
          <MainButton className={styles.view__button} onClick={handleShowMore}>
            Показать больше
          </MainButton>
        )}
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default ViewedProducts;
