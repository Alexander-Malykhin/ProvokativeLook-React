//styles
import styles from './ListProducts.module.scss'
//images
import ProductImage from '@assets/products/product-1.png'
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


const ListProducts = () => {
    return (
        <div className={styles.content}>
            <div className={styles.content__header}>
                <div className={styles.filter}>
                    <div className={styles.filter__list}>
                        {['Размер', 'Стиль', 'Цвет', 'Цена'].map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={styles.filter__item}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button type="button" className={styles.filter__button}>
                        Фильтры
                    </button>
                </div>

                <button type="button" className={styles.sort}>
                    По популярности
                </button>
            </div>

            <div className={styles.list}>
                {products.slice(0, 18).map((product) => (
                    <CardSlider
                        key={product.id}
                        image={product.image}
                        title={product.title}
                        price={product.price}
                        sizes={product.sizes}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListProducts;