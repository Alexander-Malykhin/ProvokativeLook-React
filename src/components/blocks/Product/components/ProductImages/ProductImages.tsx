import { useRef, useState } from 'react';
import styles from './ProductImages.module.scss';

import Image from '@UI/buttons/Image/Image.tsx';

interface ProductImagesProps {
    productImages: string[];
}

const ProductImages = ({ productImages }: ProductImagesProps) => {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;

        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        setActiveIndex(index);
    };

    const scrollToSlide = (index: number) => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.scrollTo({
            left: slider.clientWidth * index,
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles.slider}>
            <Image src={productImages[0]} className={styles.slider__main} />

            <div
                ref={sliderRef}
                onScroll={handleScroll}
                className={styles.slider__list}
            >
                {productImages.map((image, index) => (
                    <Image
                        key={`${image}-${index}`}
                        src={image}
                        className={styles.slider__item}
                    />
                ))}
            </div>

            {productImages.length > 1 && (
                <div className={styles.slider__dots}>
                    {productImages.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => scrollToSlide(index)}
                            className={`${styles.slider__dot} ${
                                activeIndex === index ? styles.slider__dot_active : ''
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImages;