//styles
import styles from './CatalogCategories.module.scss'
//images
import CardLeftImage from '@assets/category/cards/card-1.png'
import CardMiddleImage from '@assets/category/cards/card-2.png'
import CardRightImage from '@assets/category/cards/card-3.png'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import CatalogCategoryCard
    from "@components/blocks/CatalogCategories/components/CatalogCategoryCard/CatalogCategoryCard.tsx";

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

const CatalogCategories = () => {
    return (
        <SectionLayout className={styles.category}>
            {cards.map(item => (
                <CatalogCategoryCard key={item.id} title={item.title} path={item.path} image={item.image} position={item.position}/>
            ))}
        </SectionLayout>
    );
};

export default CatalogCategories;