//hooks
import { useHorizontalSlider } from '@/hooks/useHorizontalSlider';
//styles
import styles from './MainSliderCards.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
//components
import ActionColumn from "@components/MainSliderCards/components/ActionColumn/ActionColumn.tsx";
import CardSlider from "@components/MainSliderCards/components/CardSlider/CardSlider.tsx";
//types
import type {MainSliderCardsInterface} from "@components/MainSliderCards/types/types.ts";

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

const MainSliderCards = ({ title }: MainSliderCardsInterface) => {
    const { sliderRef, scrollSlider } = useHorizontalSlider(240);

    return (
        <SectionLayout>
            <div className={styles.slider}>
                <ActionColumn
                    title={title}
                    scrollSlider={scrollSlider}
                />

                <div ref={sliderRef} className={styles.slider__list}>
                    {products.map((item) =>
                        <CardSlider key={item.id}
                            image={item.image}
                            title={item.title}
                            sizes={item.sizes}
                            price={item.price}
                        />
                    )}
                </div>
            </div>
        </SectionLayout>
    );
};

export default MainSliderCards;