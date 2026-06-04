import allImage from "@assets/category/banner/all.png";
import newImage from "@assets/category/banner/new.png";
import setsImage from "@assets/category/banner/sets.png";
import accessoriesImage from "@assets/category/banner/accessories.png";
import saleImage from "@assets/category/banner/sale.png";
import shoesImage from "@assets/category/banner/shoes.png";
import costumesImage from "@assets/category/banner/costumes.png";
import deliveryImage from "@assets/category/banner/delivery.png";

export const navigationHomeCategory = [
    {
        id: 1,
        title: 'Все',
        image: allImage,
        path: '/catalog',
    },
    {
        id: 2,
        title: 'Новинки',
        image: newImage,
        path: '/#new-collection',
    },
    {
        id: 3,
        title: 'Комплекты',
        image: setsImage,
        path: '/catalog/sets',
    },
    {
        id: 4,
        title: 'Аксессуары',
        image: accessoriesImage,
        path: '/catalog/accessories',
    },
    {
        id: 5,
        title: 'Распродажа',
        image: saleImage,
        path: '/catalog/sale',
    },
    {
        id: 6,
        title: 'Обувь',
        image: shoesImage,
        path: '/catalog/shoes',
    },
    {
        id: 7,
        title: 'Костюмы',
        image: costumesImage,
        path: '/catalog/costumes',
    },
    {
        id: 8,
        title: 'Доставка',
        image: deliveryImage,
        path: '/info/delivery-payment',
    },
];