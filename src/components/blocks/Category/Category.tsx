import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
//images
import card1 from '@assets/category/list-trimmed/card-1.png';
import card2 from '@assets/category/list-trimmed/card-2.png';
import card3 from '@assets/category/list-trimmed/card-3.png';
import card4 from '@assets/category/list-trimmed/card-4.png';
import card5 from '@assets/category/list-trimmed/card-5.png';
import card6 from '@assets/category/list-trimmed/card-6.png';
import card7 from '@assets/category/list-trimmed/card-7.png';
import card8 from '@assets/category/list-trimmed/card-8.png';
import card9 from '@assets/category/list-trimmed/card-9.png';
import card10 from '@assets/category/list-trimmed/card-10.png';
import card11 from '@assets/category/list-trimmed/card-11.png';
import card12 from '@assets/category/list-trimmed/card-12.png';
import card13 from '@assets/category/list-trimmed/card-13.png';
import card14 from '@assets/category/list-trimmed/card-14.png';

const catalogCards = [
    {
        id: 1,
        title: 'Комбинезоны #br# и костюмы',
        path: '/catalog/kombinezony-i-kostyumy',
        image: card1,
    },
    {
        id: 2,
        title: 'Верхняя одежда',
        path: '/catalog/verhnyaya-odezhda',
        image: card2,
    },
    {
        id: 3,
        title: 'Платья #br# и сарафаны',
        path: '/catalog/platya-i-sarafany',
        image: card3,
    },
    {
        id: 4,
        title: 'Обувь',
        path: '/catalog/obuv',
        image: card4,
    },
    {
        id: 5,
        title: 'Блузы #br# и рубашки',
        path: '/catalog/bluzy-i-rubashki',
        image: card5,
    },
    {
        id: 6,
        title: 'Брюки #br# и шорты',
        path: '/catalog/bryuki-i-shorty',
        image: card6,
    },
    {
        id: 7,
        title: 'Комплекты',
        path: '/catalog/yubki',
        image: card7,
    },
    {
        id: 8,
        title: 'Топы #br# и футболки',
        path: '/catalog/topy-i-futbolki',
        image: card8,
    },
    {
        id: 9,
        title: 'Юбки',
        path: '/catalog/tolstovki-i-hudi',
        image: card9,
    },
    {
        id: 10,
        title: 'Свитеры #br# и кардиганы',
        path: '/catalog/dzhinsy',
        image: card10,
    },
    {
        id: 11,
        title: 'Толстовки и худи',
        path: '/catalog/zhakety-i-zhilety',
        image: card11,
    },
    {
        id: 12,
        title: 'Джинсы',
        path: '/catalog/svitery-i-kardigany',
        image: card12,
    },
    {
        id: 13,
        title: 'Жакеты',
        path: '/catalog/sumki',
        image: card13,
    },
    {
        id: 14,
        title: 'Аксессуары',
        path: '/catalog/kurtki',
        image: card14,
    },
];

const Category = () => {
    return (
        <CatalogCategories cards={catalogCards} variant={'grid'}/>
    );
};

export default Category;