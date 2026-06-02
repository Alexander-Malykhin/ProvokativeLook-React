import type {RefObject} from "react";
//styles
import styles from './ViewedSlider.module.scss'
//components
import CardSlider from "@components/MainSliderCards/components/CardSlider/CardSlider.tsx";

interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
    sizes: string[];
}

interface ViewedSliderInterface {
    sliderRef: RefObject<HTMLDivElement | null>;
    products: Product[];
    visibleProducts:Product[];
}

const ViewedSlider = ({ sliderRef, products, visibleProducts }:ViewedSliderInterface) => {
    return (
        <>
            <div className={styles.list} ref={sliderRef}>
                {products.map((card) => (
                    <CardSlider key={card.id} {...card} />
                ))}
            </div>

            <div className={styles.mobileList}>
                {visibleProducts.map((card) => (
                    <CardSlider key={card.id} {...card} />
                ))}
            </div>
        </>
    );
};
export default ViewedSlider;