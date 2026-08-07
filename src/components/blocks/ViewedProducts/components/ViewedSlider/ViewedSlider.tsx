// styles
import styles from "./ViewedSlider.module.scss";
// components
import ProductCard from "@components/ProductCard/ProductCard";
// types
import type { ViewedSliderProps } from "@components/blocks/ViewedProducts/types/types";

const ViewedSlider = ({
  sliderRef,
  products,
  visibleProducts,
}: ViewedSliderProps) => {
  return (
    <>
      <div ref={sliderRef} className={styles.list}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className={styles.mobileList}>
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
};

export default ViewedSlider;
