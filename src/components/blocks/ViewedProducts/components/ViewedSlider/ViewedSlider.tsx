import { useState } from "react";
import { useDragScroll } from "@hooks/useDragScroll";
import styles from "./ViewedSlider.module.scss";
import ProductCard from "@components/ProductCard/ProductCard";
import type { ViewedSliderProps } from "@components/blocks/ViewedProducts/types/types";

const ViewedSlider = ({ sliderRef, products }: ViewedSliderProps) => {
    useDragScroll(sliderRef, products.length);
    const [isExpanded, setIsExpanded] = useState(false);
    const className = [styles.list, isExpanded ? styles.list_expanded : ""].filter(Boolean).join(" ");

    return (
        <div className={styles.wrapper}>
            <div ref={sliderRef} className={className}>
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
            {products.length > 4 && !isExpanded && (
                <button type="button" className={styles.moreButton} onClick={() => setIsExpanded(true)}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default ViewedSlider;
