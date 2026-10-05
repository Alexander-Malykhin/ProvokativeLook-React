import { useDragScroll } from "@hooks/useDragScroll";
import styles from "./BestsellersSlider.module.scss";
import ProductCard from "@components/ProductCard/ProductCard";
import type { BestsellersSliderProps } from "@components/blocks/Bestsellers/types/type.ts";
const BestsellersSlider = ({ sliderRef, products }: BestsellersSliderProps) => {
    useDragScroll(sliderRef, products.length);
    return (<div ref={sliderRef} className={styles.list}>
      {products.map((product) => (<ProductCard {...product} key={product.id}/>))}
    </div>);
};
export default BestsellersSlider;
