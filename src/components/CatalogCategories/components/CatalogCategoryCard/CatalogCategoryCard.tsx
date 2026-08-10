import { Link } from "react-router-dom";
//styles
import styles from "./CatalogCategoryCard.module.scss";
//helpers
import { convertAliasTitle } from "@helpers/convertAliasTitle.tsx";
//UI
import Image from "@UI/media/Image/Image";
//types
import type { CategoryCardInterface } from "@components/CatalogCategories/types/types.ts";


const CatalogCategoryCard = ({id, image, path, title, variant = "promo", buttonText = "Смотреть все"}: CategoryCardInterface) => {

  const cardClassName = `${styles.card} ${id ? styles[`card_${id}`] : ""}`;

  const cardContent = (
    <>
      <div className={styles.card__information}>
        <h2 className={styles.card__information_title}>
          {convertAliasTitle(title)}
        </h2>

        {variant === "promo" && (
          <Link to={path} className={styles.card__information_button}>
            {buttonText}
          </Link>
        )}
      </div>

      <div className={styles.card__imageBox}>
        <Image src={image} className={styles.card__image} />
      </div>
    </>
  );

  if (variant === "grid") {
    return (
      <Link to={path} className={cardClassName}>
        {cardContent}
      </Link>
    );
  }

  return <article className={cardClassName}>{cardContent}</article>;
};

export default CatalogCategoryCard;
