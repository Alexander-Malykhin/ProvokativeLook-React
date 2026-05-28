//components
import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
//images
import CardLeftImage from "@assets/category/promo/card-1.png";
import CardMiddleImage from "@assets/category/promo/card-2.png";
import CardRightImage from "@assets/category/promo/card-3.png";

const CatalogPromo = () => {

    const cards = [
        {
            id: 1,
            title: 'Комбинезоны #br# и костюмы',
            image: CardLeftImage,
            path: '#',
            position: 'left',
        },
        {
            id: 2,
            title: 'Верхняя одежда',
            image: CardMiddleImage,
            path: '#',
            position: 'middle',
        },
        {
            id: 3,
            title: 'Платья #br# и сарафаны',
            image: CardRightImage,
            path: '#',
            position: 'right',
        },
    ] as const;

    return (
        <CatalogCategories cards={cards} variant={'promo'}/>
    );
};

export default CatalogPromo;