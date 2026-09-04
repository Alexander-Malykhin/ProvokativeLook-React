import { useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import Image from "@UI/media/Image/Image";
import styles from "./ProductCard.module.scss";
import ProductCardSizes from "./components/ProductCardSizes";
import type { ProductListItem } from "@/types/product";
import { slugifyCatalogValue } from "@/helpers/catalog";
export type ProductCardProps = ProductListItem & {
    variant?: "default" | "catalog" | "search";
};
const ProductCard = ({ slug, sectionSlug, image, title, price, sizes, variant = "default" }: ProductCardProps) => {
  const titleRef = useRef<HTMLSpanElement>(null);
  const productPath = `/catalog/${sectionSlug || 'catalog'}/${slug || slugifyCatalogValue(title)}/`;
  const prepareTitleMarquee = (event: MouseEvent<HTMLAnchorElement>) => {
    const titleElement = titleRef.current;
    if (!titleElement) return;
    const overflow = Math.max(0, titleElement.scrollWidth - event.currentTarget.clientWidth);
    event.currentTarget.dataset.marquee = overflow > 2 ? "true" : "false";
    event.currentTarget.style.setProperty("--title-shift", `${-overflow}px`);
  };
  return (
  <article className={`${styles.card} ${variant === "catalog" ? styles.card_catalog : ""} ${variant === "search" ? styles.card_search : ""}`}>
    <Link to={productPath} className={styles.card__header} aria-label={`Открыть товар ${title}`}>
      {image ? (<Image src={image} alt={title} className={styles.card__image}/>) : (<div className={styles.card__placeholder} aria-label="Фотография товара отсутствует">
          <span className={styles.card__placeholderIcon} aria-hidden="true">▧</span>
          <span>Фото скоро появится</span>
        </div>)}
    </Link>

    <div className={styles.card__body}>
      <div className={styles.card__information}>
        <Link
          to={productPath}
          className={styles.card__information_title}
          title={title}
          onMouseEnter={prepareTitleMarquee}
        >
          <span ref={titleRef} className={styles.card__information_titleText}>{title}</span>
        </Link>
        {variant !== "search" && <ProductCardSizes sizes={sizes}/>}
      </div>
      <span className={styles.card__price}>{price}</span>
    </div>
  </article>);
};
export default ProductCard;
