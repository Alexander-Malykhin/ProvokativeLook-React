import styles from './CatalogPromo.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import { useGetBannersQuery } from '@store/api/banners/bannersApi';
import { useCarousel } from '@hooks/useCarousel';
import CarouselDots from '@components/Carousel/CarouselDots';
import CatalogPromoItem from './components/CatalogPromoItem/CatalogPromoItem';
const CatalogPromo = () => {
  const { data } = useGetBannersQuery('banners1x3');
  const promoCategories = [...(data?.items ?? [])].sort((a, b) => a.sort - b.sort);
  const { sliderRef, activeIndex, scrollToIndex } = useCarousel({
    itemCount: promoCategories.length,
    mode: 'progress',
  });
  if (promoCategories.length === 0) {
    return null;
  }
  return (
    <SectionLayout className={styles.promo}>
      <div ref={sliderRef} className={styles.promo__list}>
        {promoCategories.map((category, index) => (
          <CatalogPromoItem
            key={category.id}
            index={index + 1}
            title={category.title}
            image={category.image}
            link={category.link}
          />
        ))}
      </div>
      <CarouselDots count={promoCategories.length} activeIndex={activeIndex} onChange={scrollToIndex} compact />
    </SectionLayout>
  );
};
export default CatalogPromo;
