import { useState } from "react";
import { useDragScroll } from "@hooks/useDragScroll";
import styles from "./ViewedSlider.module.scss";
import { Link } from "react-router-dom";
import Image from "@UI/media/Image/Image";
import { slugifyCatalogValue } from "@/helpers/catalog";
import type { ViewedSliderProps } from "@components/blocks/ViewedProducts/types/types";

const ViewedSlider = ({ sliderRef, products }: ViewedSliderProps) => {
    useDragScroll(sliderRef, products.length);
    const [isExpanded, setIsExpanded] = useState(false);
    const className = [styles.list, isExpanded ? styles.list_expanded : ""].filter(Boolean).join(" ");

    return (
        <div className={styles.wrapper}>
            <div ref={sliderRef} className={className}>
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/catalog/${product.sectionSlug || 'catalog'}/${product.slug || slugifyCatalogValue(product.title)}/`}
                        className={styles.item}
                        aria-label={`Открыть товар ${product.title}`}
                    >
                        <Image src={product.image} alt={product.title} className={styles.image} draggable={false}/>
                    </Link>
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
