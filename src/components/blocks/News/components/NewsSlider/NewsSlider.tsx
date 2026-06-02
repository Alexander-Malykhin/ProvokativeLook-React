import type {RefObject} from "react";
//styles
import styles from './NewsSlider.module.scss'
//components
import CardSlider from "@components/MainSliderCards/components/CardSlider/CardSlider.tsx";

interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
    sizes: string[];
}

interface NewsSliderInterface {
    sliderRef: RefObject<HTMLDivElement | null>;
    products: Product[];
}

const NewsSlider = ({sliderRef, products}: NewsSliderInterface) => {
    return (
        <div className={styles.list} ref={sliderRef}>
            {products.map((card) => (
                <CardSlider
                    key={card.id}
                    image={card.image}
                    title={card.title}
                    sizes={card.sizes}
                    price={card.price}
                />
            ))}
        </div>
    );
};

export default NewsSlider;