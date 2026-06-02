import {useEffect, useRef, useState} from "react";
//styles
import styles from './Bestsellers.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import BestsellersColumn from "@components/blocks/Bestsellers/components/BestsellersColumn/BestellersColumn.tsx";
import BestsellersSlider from "@components/blocks/Bestsellers/components/BestsellersSlider/BestsellersSlider.tsx";
import BestsellersDots from "@components/blocks/Bestsellers/components/BestsellersDots/BestsellersDots.tsx";

const products = [
    {
        id: 1,
        title: 'Шуба',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 2,
        title: 'Босоножки',
        image: 'products/product-1.png',
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 3,
        title: 'Комбинезон с накидкой',
        image: 'products/product-1.png',
        price: '11 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 4,
        title: 'Свитшот',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 5,
        title: 'Шуба',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 6,
        title: 'Босоножки',
        image: 'products/product-1.png',
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 7,
        title: 'Шуба',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 8,
        title: 'Босоножки',
        image: 'products/product-1.png',
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 9,
        title: 'Комбинезон с накидкой',
        image: 'products/product-1.png',
        price: '11 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 10,
        title: 'Свитшот',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 11,
        title: 'Шуба',
        image: 'products/product-1.png',
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 12,
        title: 'Босоножки',
        image: 'products/product-1.png',
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
];

const Bestsellers = () => {

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const getScrollStep = () => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return 0;

        const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;

        return firstCard.offsetWidth + gap;
    };

    const scrollToIndex = (index: number) => {
        const slider = sliderRef.current;
        const scrollStep = getScrollStep();

        if (!slider) return;

        slider.scrollTo({
            left: scrollStep * index,
            behavior: 'smooth',
        });

        setActiveIndex(index);
    };

    const handleScroll = (direction: 'prev' | 'next') => {
        const nextIndex =
            direction === 'next'
                ? Math.min(activeIndex + 1, products.length - 1)
                : Math.max(activeIndex - 1, 0);

        scrollToIndex(nextIndex);
    };

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        const handleSliderScroll = () => {
            const scrollStep = getScrollStep();

            if (!scrollStep) return;

            setActiveIndex(Math.round(slider.scrollLeft / scrollStep));
        };

        slider.addEventListener('scroll', handleSliderScroll);

        return () => {
            slider.removeEventListener('scroll', handleSliderScroll);
        };
    }, []);

    return (
        <SectionLayout className={styles.bestsellers}>
            <BestsellersColumn
                onPrev={() => handleScroll('prev')}
                onNext={() => handleScroll('next')}
            />
            <BestsellersSlider
                sliderRef={sliderRef}
                products={products}
            />
            <BestsellersDots
                count={products.length}
                activeIndex={activeIndex}
                onDotClick={scrollToIndex}
            />
        </SectionLayout>
    );
};

export default Bestsellers;