// styles
import styles from "./BestsellersSlider.module.scss";
// components
import ProductCard from "@components/ProductCard/ProductCard";
// types
import type { BestsellersSliderProps } from "@components/blocks/Bestsellers/types/type.ts";

const BestsellersSlider = ({ sliderRef, products }: BestsellersSliderProps) => {
  return (
    <div ref={sliderRef} className={styles.list}>
      {products.map((product) => (
        <ProductCard
          id={product.id}
          key={product.id}
          image={product.image}
          title={product.title}
          sizes={product.sizes}
          price={product.price}
        />
      ))}
    </div>
  );
};

export default BestsellersSlider;
