// styles
import styles from "./NewsSlider.module.scss";
// components
import ProductCard from "@components/ProductCard/ProductCard";
// types
import type { NewsSliderProps } from "@components/blocks/News/components/types/types.ts";

const NewsSlider = ({ sliderRef, products }: NewsSliderProps) => {
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

export default NewsSlider;
