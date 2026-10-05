import styles from "./Bestsellers.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetFeaturedProductsQuery } from "@store/api/catalog/catalogApi";
import { catalogProductToListItem } from "@store/api/catalog/format";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import BestsellersSlider from "./components/BestsellersSlider/BestsellersSlider";
const Bestsellers = () => {
    const { data } = useGetFeaturedProductsQuery('bestsellers');
    const products = (data?.products ?? []).filter((product) => Boolean(product.image?.trim())).map(catalogProductToListItem);
    const carousel = useCarousel({ itemCount: products.length });
    if (products.length === 0) return null;
    return (<SectionLayout className={styles.bestsellers}>
      <CarouselHeader title="Бестселлеры" onPrevious={carousel.showPrevious} onNext={carousel.showNext}/>
      <BestsellersSlider sliderRef={carousel.sliderRef} products={products}/>
      <CarouselDots count={products.length} activeIndex={carousel.activeIndex} onChange={carousel.scrollToIndex}/>
    </SectionLayout>);
};
export default Bestsellers;
