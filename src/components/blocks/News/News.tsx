import styles from './News.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import { useFeaturedCarousel } from '@hooks/useFeaturedCarousel';
import FeaturedLoadMore from '@components/Carousel/FeaturedLoadMore';
import CarouselHeader from '@components/Carousel/CarouselHeader';
import CarouselDots from '@components/Carousel/CarouselDots';
import NewsSlider from './components/NewsSlider/NewsSlider';
const News = () => {
  const { products, carousel, hasNextPage, isFetching, isError, loadMore } = useFeaturedCarousel('new');
  if (products.length === 0 && !hasNextPage && !isFetching && !isError) return null;
  return (
    <SectionLayout className={styles.news} id="new-collection">
      <CarouselHeader title="Новинки" onPrevious={carousel.showPrevious} onNext={carousel.showNext} />
      <NewsSlider sliderRef={carousel.sliderRef} products={products} />
      <CarouselDots
        count={products.length}
        activeIndex={carousel.activeIndex}
        onChange={carousel.scrollToIndex}
        maxVisible={7}
      />
      <FeaturedLoadMore isFetching={isFetching} isError={isError} hasNextPage={hasNextPage} onLoad={loadMore} />
    </SectionLayout>
  );
};
export default News;
