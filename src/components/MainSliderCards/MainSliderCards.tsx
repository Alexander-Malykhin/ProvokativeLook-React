//hooks
import { useHorizontalSlider } from '@/hooks/useHorizontalSlider';
//styles
import styles from './MainSliderCards.module.scss';
//images
import SliderArrowRightImage from '@assets/arrows/arrow-right-gray.svg';
import SliderArrowLeftImage from '@assets/arrows/arrow-left-gray.svg';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
//UI
import Image from '@UI/buttons/Image/Image';
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
];

const MainSliderCards = ({ title }: MainSliderCardsInterface) => {
    const { sliderRef, scrollSlider } = useHorizontalSlider(240);


    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.slider}>
                <div className={styles.slider__column}>
                    <h2 className={styles.slider__title}>{title}</h2>

                    <div className={styles.slider__buttons}>
                        <button
                            type="button"
                            className={styles.slider__arrow}
                            onClick={() => scrollSlider('left')}
                        >
                            <Image src={SliderArrowLeftImage} className={styles.slider__arrow_image} />
                        </button>

                        <button
                            type="button"
                            className={styles.slider__arrow}
                            onClick={() => scrollSlider('right')}
                        >
                            <Image src={SliderArrowRightImage} className={styles.slider__arrow_image} />
                        </button>
                    </div>
                </div>

                <div ref={sliderRef} className={styles.slider__list}>
                    {products.map((item) => (
                        <article key={item.id} className={styles.slider__card}>
                            <div className={styles.slider__card_image}>
                                <img src={`${import.meta.env.BASE_URL}${item.image}`} alt={item.title} />
                            </div>

                            <h3 className={styles.slider__card_title}>{item.title}</h3>

                            <div className={styles.slider__sizes}>
                                {item.sizes.map((size) => (
                                    <span key={size} className={styles.slider__size}>
                                        {size}
                                    </span>
                                ))}
                            </div>

                            <p className={styles.slider__price}>{item.price}</p>
                        </article>
                    ))}
                </div>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default MainSliderCards;