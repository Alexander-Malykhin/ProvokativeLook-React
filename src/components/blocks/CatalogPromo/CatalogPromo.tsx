import styles from "./CatalogPromo.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetHomeQuery } from "@store/api/home/homeApi";
import { useCarousel } from "@hooks/useCarousel";
import CarouselDots from "@components/Carousel/CarouselDots";
import CatalogPromoItem from "./components/CatalogPromoItem/CatalogPromoItem";
import { CATALOG_PROMO_ORDER } from "./data";

const CatalogPromo = () => {
  const { data } = useGetHomeQuery();
  const promoCategories = [...(data?.categories ?? [])]
    .filter((category) => category.properties.CATEGORY_SHOW_PROMO === "Да")
    .sort(
      (a, b) =>
        CATALOG_PROMO_ORDER.indexOf(a.properties.CATEGORY_NAME_PROMO) -
        CATALOG_PROMO_ORDER.indexOf(b.properties.CATEGORY_NAME_PROMO),
    );
  const carousel = useCarousel({
    itemCount: promoCategories.length,
    mode: "progress",
  });

  if (promoCategories.length === 0) {
    return null;
  }

  return (
    <SectionLayout className={styles.promo}>
      <div ref={carousel.sliderRef} className={styles.promo__list}>
        {promoCategories.map((category, index) => (
          <CatalogPromoItem
            key={category.id}
            index={index + 1}
            title={category.properties.CATEGORY_NAME_PROMO}
            image={category.properties.CATEGORY_IMAGE_PROMO}
            link={category.properties.CATEGORY_LINK}
          />
        ))}
      </div>
      <CarouselDots
        count={promoCategories.length}
        activeIndex={carousel.activeIndex}
        onChange={carousel.scrollToIndex}
        compact
      />
    </SectionLayout>
  );
};

export default CatalogPromo;
