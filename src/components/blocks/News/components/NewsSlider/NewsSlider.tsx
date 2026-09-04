import styles from "./NewsSlider.module.scss";
import ProductCard from "@components/ProductCard/ProductCard";
import type { NewsSliderProps } from "@components/blocks/News/components/types/types.ts";
const NewsSlider = ({ sliderRef, products }: NewsSliderProps) => {
    return (<div ref={sliderRef} className={styles.list}>
      {products.map((product) => (<ProductCard {...product} key={product.id}/>))}
    </div>);
};
export default NewsSlider;
