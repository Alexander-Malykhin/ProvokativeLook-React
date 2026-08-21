import styles from "./ViewedSlider.module.scss";
import ProductCard from "@components/ProductCard/ProductCard";
import type { ViewedSliderProps } from "@components/blocks/ViewedProducts/types/types";
const ViewedSlider = ({ sliderRef, products }: ViewedSliderProps) => {
    const className = `${styles.list} ${products.length === 1 ? styles.list_single : ""}`.trim();

    return (<div ref={sliderRef} className={className}>
      {products.map((product) => (<ProductCard key={product.id} {...product}/>))}
    </div>);
};
export default ViewedSlider;
