import styles from "./News.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { products } from "@api/static/products";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import NewsSlider from "./components/NewsSlider/NewsSlider";

const News = () => {
  const carousel = useCarousel({ itemCount: products.length });

  return (
    <SectionLayout className={styles.news} id="new-collection">
      <CarouselHeader
        title="Новинки"
        onPrevious={carousel.showPrevious}
        onNext={carousel.showNext}
      />
      <NewsSlider sliderRef={carousel.sliderRef} products={products} />
      <CarouselDots
        count={products.length}
        activeIndex={carousel.activeIndex}
        onChange={carousel.scrollToIndex}
      />
    </SectionLayout>
  );
};

export default News;
