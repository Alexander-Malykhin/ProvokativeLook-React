import { useState } from "react";
import { useAppDispatch } from "@store/hooks";

import styles from "./ProductSizes.module.scss";
import { openTableSizes } from "@store/slices/toggleModalTableSizesSlice.ts";

const sizes = [44, 46, 48];

const ProductSizes = () => {
  const dispatch = useAppDispatch();
  const [activeSize, setActiveSize] = useState(sizes[0]);

  return (
    <div className={styles.sizes}>
      <h2 className={styles.sizes__title}>размер</h2>

      <div className={styles.sizes__list}>
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setActiveSize(size)}
            className={`${styles.sizes__item} ${
              activeSize === size ? styles.sizes__item_active : ""
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.sizes__button}
        onClick={() => dispatch(openTableSizes())}
      >
        Таблица размеров
      </button>
    </div>
  );
};

export default ProductSizes;
