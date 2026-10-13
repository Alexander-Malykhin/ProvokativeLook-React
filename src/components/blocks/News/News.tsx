import { useMemo } from "react";
import styles from "./News.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetFeaturedProductsQuery } from "@store/api/catalog/catalogApi";
import { catalogProductToListItem } from "@store/api/catalog/format";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import NewsSlider from "./components/NewsSlider/NewsSlider";
const News = () => {
    const { data } = useGetFeaturedProductsQuery('new');
    const products = useMemo(() => (data?.products ?? []).filter((product) => Boolean(product.image?.trim())).map(catalogProductToListItem), [data]);
    const carousel = useCarousel({ itemCount: products.length });
    if (products.length === 0) return null;
    return (<SectionLayout className={styles.news} id="new-collection">
      <CarouselHeader title="Новинки" onPrevious={carousel.showPrevious} onNext={carousel.showNext}/>
      <NewsSlider sliderRef={carousel.sliderRef} products={products}/>
      <CarouselDots count={products.length} activeIndex={carousel.activeIndex} onChange={carousel.scrollToIndex} maxVisible={7}/>
    </SectionLayout>);
};
export default News;
