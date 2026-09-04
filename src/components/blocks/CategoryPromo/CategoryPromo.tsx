import styles from "./CategoryPromo.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import CategoryPromoSkeleton from "@components/blocks/CategoryPromo/components/CategoryPromoSkeleton/CategoryPromoSkeleton";
import CategoryPromoItem from "@components/blocks/CategoryPromo/components/CategoryPromoItem/CategoryPromoItem";
import { useGetBannersQuery } from "@store/api/banners/bannersApi";
const CategoryPromo = () => {
    const { data, isLoading, isError } = useGetBannersQuery('banners1x2');
    if (isLoading)
        return <CategoryPromoSkeleton />;
    if (isError || !data)
        return null;
    const promoItems = [...(data.items ?? [])].sort((a, b) => a.sort - b.sort);
    if (promoItems.length === 0) {
        return null;
    }
    return (<SectionLayout>
      <MainLayoutContainer className={styles.promo}>
        {promoItems.map((item) => (<CategoryPromoItem key={item.id} item={item}/>))}
      </MainLayoutContainer>
    </SectionLayout>);
};
export default CategoryPromo;
