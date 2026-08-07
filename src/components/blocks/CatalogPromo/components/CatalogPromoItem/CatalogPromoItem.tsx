import { Link } from "react-router-dom";
// styles
import styles from "./CatalogPromoItem.module.scss";
// UI
import Image from "@UI/media/Image/Image";
// helpers
import { convertAliasTitle } from "@helpers/convertAliasTitle";
// types
import type { CatalogPromoItemProps } from "@components/blocks/CatalogPromo/types/types";

const CatalogPromoItem = ({
  index,
  title,
  image,
  link,
}: CatalogPromoItemProps) => {
  return (
    <article className={`${styles.item} ${styles[`item_${index}`]}`}>
      <div className={styles.item__information}>
        <h2 className={styles.item__information_title}>
          {convertAliasTitle(title)}
        </h2>

        <Link to={link} className={styles.item__information_button}>
          Смотреть все
        </Link>
      </div>

      {image && (
        <div className={styles.item__imageBox}>
          <Image src={image} alt={title} className={styles.item__image} />
        </div>
      )}
    </article>
  );
};

export default CatalogPromoItem;
