import { Link } from "react-router-dom";
// styles
import styles from "./CategoryPromoItem.module.scss";
// UI
import Image from "@UI/media/Image/Image";
import Title from "@UI/typography/Title/Title";
// types
import type { CategoryPromoItemProps } from "@components/blocks/CategoryPromo/types/types";

const CategoryPromoItem = ({ item }: CategoryPromoItemProps) => {
  const { CATEGORY_LINK, CATEGORY_IMAGE_PROMO, CATEGORY_NAME_PROMO } =
    item.properties;

  return (
    <Link to={CATEGORY_LINK} className={styles.item}>
      {CATEGORY_IMAGE_PROMO && (
        <Image
          src={CATEGORY_IMAGE_PROMO}
          alt={CATEGORY_NAME_PROMO}
          className={styles.item__image}
        />
      )}

      <div className={styles.item__information}>
        <Title className={styles.item__title} size="xl">
          {CATEGORY_NAME_PROMO}
        </Title>
      </div>
    </Link>
  );
};

export default CategoryPromoItem;
