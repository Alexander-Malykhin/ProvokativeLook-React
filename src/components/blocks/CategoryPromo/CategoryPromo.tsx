import { Link } from 'react-router-dom';
//styles
import styles from './CategoryPromo.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
//UI
import Image from '@UI/buttons/Image/Image';
import Title from "@UI/typography/Title/Title.tsx";
//components
import CategoryPromoSkeleton from "@components/blocks/CategoryPromo/components/CategoryPromoSkeleton.tsx";
//api
import { useGetHomeQuery } from "@store/api/home/homeApi.ts";

const CategoryPromo = () => {
    const { data, isLoading, isError } = useGetHomeQuery();

    if (isLoading) return <CategoryPromoSkeleton />;
    if (isError || !data) return null;

    const promoItems = data.promoCategory.filter(
        (item) => item.properties.CATEGORY_SHOW_PROMO === 'Да'
    );

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.promo}>
                {promoItems.map((item) => (
                    <Link key={item.id} to={item.properties.CATEGORY_LINK} className={styles.promo__item}>
                        {item.properties.CATEGORY_IMAGE_PROMO && (
                            <Image
                                src={item.properties.CATEGORY_IMAGE_PROMO}
                                alt={item.properties.CATEGORY_NAME_PROMO}
                                className={styles.promo__image}
                            />
                        )}

                        <div className={styles.promo__information}>
                            <Title className={styles.promo__title} size="xl">
                                {item.properties.CATEGORY_NAME_PROMO}
                            </Title>
                        </div>
                    </Link>
                )).reverse()}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default CategoryPromo;