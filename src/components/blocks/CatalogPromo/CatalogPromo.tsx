import styles from "./CatalogPromo.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetCategoriesQuery } from "@store/api/categories/categoriesApi";
import { useCarousel } from "@hooks/useCarousel";
import CarouselDots from "@components/Carousel/CarouselDots";
import CatalogPromoItem from "./components/CatalogPromoItem/CatalogPromoItem";
import { CATALOG_PROMO_ORDER } from "./data";

const CatalogPromo = () => {
  const { data } = useGetCategoriesQuery();

  const promoCategories = [...(data?.items ?? [])]
    .filter((category) => category.catalog.show)
    .sort((a, b) => {
      const aIndex = CATALOG_PROMO_ORDER.indexOf(a.catalog.title);
      const bIndex = CATALOG_PROMO_ORDER.indexOf(b.catalog.title);

      if (aIndex === -1 && bIndex === -1) return a.sort - b.sort;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

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
            title={category.catalog.title}
            image={category.catalog.image}
            link={category.link}
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
