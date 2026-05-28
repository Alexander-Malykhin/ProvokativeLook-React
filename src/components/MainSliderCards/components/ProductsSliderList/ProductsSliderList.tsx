import type { RefObject } from 'react';

import styles from './ProductsSliderList.module.scss';

import CardSlider from '@components/MainSliderCards/components/CardSlider/CardSlider';

interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
    sizes: string[];
}

interface ProductsSliderListProps {
    sliderRef: RefObject<HTMLDivElement | null>;
    products: Product[];
    variant?: 'default' | 'five';
}

const ProductsSliderList = ({sliderRef, products, variant = 'default',}: ProductsSliderListProps) => {
    return (
        <div
            ref={sliderRef}
            className={`${styles.list} ${styles[`list_${variant}`]}`}
        >
            {products.map((item) => (
                <CardSlider
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    sizes={item.sizes}
                    price={item.price}
                />
            ))}
        </div>
    );
};

export default ProductsSliderList;