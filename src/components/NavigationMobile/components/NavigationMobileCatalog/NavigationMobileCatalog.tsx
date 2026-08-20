import { NavLink } from "react-router-dom";
//styles
import styles from "./NavigationMobileCatalog.module.scss";
//images
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
//UI
import Image from "@UI/media/Image/Image";
//types
import type { NavigationMobileCatalogInterface } from "./types";
//store
import { useGetCategoriesQuery } from "@store/api/categories/categoriesApi";
//helpers
import { getCatalogCategorySlug, normalizeCatalogTitle } from "@/helpers/catalog";

const NavigationMobileCatalog = ({
  onBack,
  onClose,
}: NavigationMobileCatalogInterface) => {
  const { data } = useGetCategoriesQuery();

  const catalogItems = [
    { text: "СМОТРЕТЬ ВСЁ", path: "/catalog/all" },
    ...(data?.items ?? [])
      .filter((item) => item.catalogPage.show)
      .filter((item) => item.sectionIds.length > 0)
      .sort((a, b) => a.sort - b.sort || a.id - b.id)
      .map((item) => ({
        text: normalizeCatalogTitle(item.name),
        path: `/catalog/${getCatalogCategorySlug(item)}`,
      })),
  ];

  return (
    <nav className={styles.catalog}>
      <button type="button" className={styles.catalog__back} onClick={onBack}>
        <Image
          src={arrowRightImage}
          alt="arrow-icon"
          className={styles.catalog__back_image}
        />
        Каталог
      </button>

      <div className={styles.catalog__list}>
        {catalogItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={styles.catalog__item}
            onClick={onClose}
          >
            {item.text}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMobileCatalog;
