//styles
import styles from './Favorites.module.scss'
//images
import ProductImage from "@assets/products/product-1.png";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import FavoritesHeader from "@components/blocks/Favorites/components/FavoritesHeader.tsx";
//components
import CardSlider from "@components/MainSliderCards/components/CardSlider/CardSlider.tsx";

const products = [
    {
        id: 1,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 2,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 3,
        title: 'Комбинезон с накидкой',
        image: ProductImage,
        price: '11 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 4,
        title: 'Свитшот',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 5,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 6,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 7,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 8,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 9,
        title: 'Комбинезон с накидкой',
        image: ProductImage,
        price: '11 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 10,
        title: 'Свитшот',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 11,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 12,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 13,
        title: 'Свитшот',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 14,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 15,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 16,
        title: 'Свитшот',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52'],
    },
    {
        id: 17,
        title: 'Шуба',
        image: ProductImage,
        price: '17 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
    {
        id: 18,
        title: 'Босоножки',
        image: ProductImage,
        price: '7 700 ₽',
        sizes: ['48', '50', '52', '54'],
    },
];

const Favorites = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.favorites}>
                <FavoritesHeader/>
                <div className={styles.favorites__list}>
                    {products.map(card =>
                        <CardSlider
                            key={card.id}
                            image={card.image}
                            title={card.title}
                            sizes={card.sizes}
                            price={card.price}
                        />
                    )}
                </div>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Favorites;