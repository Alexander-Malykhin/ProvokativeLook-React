// styles
import styles from "./BannerCategory.module.scss";
// components
import BannerCategoryItem from "@components/blocks/Banner/components/BannerCategoryItem/BannerCategoryItem.tsx";
// types
import type { BannerCategoryProps } from "@components/blocks/Banner/types/types.ts";

const BannerCategory = ({ items }: BannerCategoryProps) => {
  const bannerItems = items.filter(
    (item) => item.properties.CATEGORY_SHOW_BANNER === "Да",
  );

  if (bannerItems.length === 0) return null;

  return (
    <div className={styles.category}>
      <div className={styles.category__list}>
        {bannerItems.map((item) => (
          <BannerCategoryItem
            key={item.id}
            image={item.properties.CATEGORY_IMAGE_BANNER}
            title={item.properties.CATEGORY_NAME_BANNER || item.title}
            path={item.properties.CATEGORY_LINK}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCategory;
