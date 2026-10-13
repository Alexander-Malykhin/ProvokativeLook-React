import styles from "./NewsSlider.module.scss";
import FeaturedProductsSlider from "@components/Carousel/FeaturedProductsSlider";
import type { NewsSliderProps } from "@components/blocks/News/components/types/types.ts";
const NewsSlider = ({ sliderRef, products }: NewsSliderProps) => {
    return <FeaturedProductsSlider sliderRef={sliderRef} products={products} className={styles.list}/>;
};
export default NewsSlider;
