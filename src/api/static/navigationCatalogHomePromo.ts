import CardLeftImage from "@assets/category/list-trimmed/card-1.png";
import CardMiddleImage from "@assets/category/list-trimmed/card-2.png";
import CardRightImage from "@assets/category/list-trimmed/card-3.png";

export const navigationCatalogHomePromo = [
    {
        id: 1,
        title: 'Комбинезоны #br# и костюмы',
        image: CardLeftImage,
        path: '#',
        position: 'left',
    },
    {
        id: 2,
        title: 'Верхняя #br# одежда',
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