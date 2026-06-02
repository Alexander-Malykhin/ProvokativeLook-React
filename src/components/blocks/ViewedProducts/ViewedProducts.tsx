import {useRef, useState} from "react";
//styles
import styles from './ViewedProducts.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import ViewedColumn from "@components/blocks/ViewedProducts/components/ViewedColumn/ViewedColumn.tsx";
import ViewedSlider from "@components/blocks/ViewedProducts/components/ViewedSlider/ViewedSlider.tsx";
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";

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

const ViewedProducts = () => {

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [visibleCount, setVisibleCount] = useState(4);

    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    const handleScroll = (direction: 'prev' | 'next') => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollBy({
            left: direction === 'next' ? slider.clientWidth : -slider.clientWidth,
            behavior: 'smooth',
        });
    };

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 4);
    };


    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.view}>
                <ViewedColumn
                    onPrev={() => handleScroll('prev')}
                    onNext={() => handleScroll('next')}
                />
                <ViewedSlider
                    sliderRef={sliderRef}
                    products={products}
                    visibleProducts={visibleProducts}
                />
                {hasMore && (
                    <MainButton
                        className={styles.view__button}
                        onClick={handleShowMore}
                    >
                        Показать больше
                    </MainButton>
                )}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default ViewedProducts;
