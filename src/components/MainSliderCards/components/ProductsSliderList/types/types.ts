import type {RefObject} from "react";

export interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
    sizes: string[];
}

export interface ProductsSliderListProps {
    sliderRef: RefObject<HTMLDivElement | null>;
    products: Product[];
    variant?: 'default' | 'five';
    mode?: 'slider' | 'grid';
}
