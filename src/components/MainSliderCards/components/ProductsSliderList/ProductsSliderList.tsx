//styles
import styles from './ProductsSliderList.module.scss';
//components
import CardSlider from '@components/MainSliderCards/components/CardSlider/CardSlider';
//types
import type {ProductsSliderListProps} from "@components/MainSliderCards/components/ProductsSliderList/types/types.ts";

const ProductsSliderList = ({sliderRef, products, variant = 'default', mode = 'slider',}: ProductsSliderListProps) => {
    return (
        <div
            ref={sliderRef}
            className={`${styles.list} ${styles[`list_${variant}`]} ${
                styles[`list_${mode}`]
            }`}
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