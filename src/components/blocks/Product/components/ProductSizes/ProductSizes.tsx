import { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './ProductSizes.module.scss';
import { toggleModalTableSizes } from '@store/slices/toggleModalTableSizesSlice.ts';

const sizes = [44, 46, 48];

const ProductSizes = () => {
    const dispatch = useDispatch();
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
                            activeSize === size ? styles.sizes__item_active : ''
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>

            <button
                type="button"
                className={styles.sizes__button}
                onClick={() => dispatch(toggleModalTableSizes())}
            >
                Таблица размеров
            </button>
        </div>
    );
};

export default ProductSizes;