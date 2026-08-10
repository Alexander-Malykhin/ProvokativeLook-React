// styles
import styles from "./ViewedSlider.module.scss";
// components
import ProductCard from "@components/ProductCard/ProductCard";
// types
import type { ViewedSliderProps } from "@components/blocks/ViewedProducts/types/types";

const ViewedSlider = ({ sliderRef, products }: ViewedSliderProps) => {
  return (
    <div ref={sliderRef} className={styles.list}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ViewedSlider;
