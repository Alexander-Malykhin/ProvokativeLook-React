//components
import MainSliderCards from "@components/MainSliderCards/MainSliderCards.tsx";
import ProductsSliderList from "@components/MainSliderCards/components/ProductsSliderList/ProductsSliderList.tsx";

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
    return (
        <MainSliderCards title="Бестселлеры">
            {({ sliderRef }) => (
                <ProductsSliderList sliderRef={sliderRef} products={products}/>
            )}
        </MainSliderCards>
    );
};

export default Bestsellers;