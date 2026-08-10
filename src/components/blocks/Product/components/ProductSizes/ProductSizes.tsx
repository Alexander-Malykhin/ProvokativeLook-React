import { useAppDispatch } from "@store/hooks";

import styles from "./ProductSizes.module.scss";
import { openTableSizes } from "@store/slices/toggleModalTableSizesSlice.ts";

interface ProductSizesProps {
  sizes: string[];
  selectedSize: string | null;
  disabledSizes?: string[];
  onChange: (size: string) => void;
}

const ProductSizes = ({
  sizes,
  selectedSize,
  disabledSizes = [],
  onChange,
}: ProductSizesProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.sizes}>
      <h2 className={styles.sizes__title}>размер</h2>

      <div className={styles.sizes__list}>
        {sizes.map((size) => {
          const disabled = disabledSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
              title={disabled ? `Размер ${size} сейчас отсутствует` : `Размер ${size}`}
              onClick={() => onChange(size)}
              className={`${styles.sizes__item} ${
                selectedSize === size ? styles.sizes__item_active : ""
              } ${disabled ? styles.sizes__item_disabled : ""}`}
            >
              {size}
            </button>
          );
        })}
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
