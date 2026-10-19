import styles from './BestsellersSlider.module.scss';
import FeaturedProductsSlider from '@components/Carousel/FeaturedProductsSlider';
import type { BestsellersSliderProps } from '@components/blocks/Bestsellers/types/type.ts';
const BestsellersSlider = ({ sliderRef, products }: BestsellersSliderProps) => {
  return <FeaturedProductsSlider sliderRef={sliderRef} products={products} className={styles.list} />;
};
export default BestsellersSlider;
