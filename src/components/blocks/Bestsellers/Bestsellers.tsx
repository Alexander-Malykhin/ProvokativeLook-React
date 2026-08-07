import styles from "./Bestsellers.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { products } from "@api/static/products";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import BestsellersSlider from "./components/BestsellersSlider/BestsellersSlider";

const Bestsellers = () => {
  const carousel = useCarousel({ itemCount: products.length });

  return (
    <SectionLayout className={styles.bestsellers}>
      <CarouselHeader
        title="Бестселлеры"
        onPrevious={carousel.showPrevious}
        onNext={carousel.showNext}
      />
      <BestsellersSlider sliderRef={carousel.sliderRef} products={products} />
      <CarouselDots
        count={products.length}
        activeIndex={carousel.activeIndex}
        onChange={carousel.scrollToIndex}
      />
    </SectionLayout>
  );
};

export default Bestsellers;
