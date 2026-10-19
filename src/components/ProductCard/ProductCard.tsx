import { useRef, useState, type MouseEvent } from 'react';
import ProductQuickBuy from './components/ProductQuickBuy';
import ProductCardSizes from './components/ProductCardSizes';
import { Link } from 'react-router-dom';
import Image from '@UI/media/Image/Image';
import styles from './ProductCard.module.scss';
import type { ProductListItem } from '@/types/product';
import { slugifyCatalogValue } from '@/helpers/catalog';
export type ProductCardProps = ProductListItem & {
  variant?: 'default' | 'catalog' | 'search';
  showPurchase?: boolean;
  showSizes?: boolean;
};
const ProductCard = ({
  slug,
  sectionSlug,
  image,
  title,
  price,
  sizes,
  variant = 'default',
  showPurchase = true,
  showSizes = true,
  canBuy = true,
}: ProductCardProps) => {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const productPath = `/catalog/${sectionSlug || 'catalog'}/${slug || slugifyCatalogValue(title)}/`;
  const prepareTitleMarquee = (event: MouseEvent<HTMLAnchorElement>) => {
    const titleElement = titleRef.current;
    if (!titleElement) return;
    const overflow = Math.max(0, titleElement.scrollWidth - event.currentTarget.clientWidth);
    event.currentTarget.dataset.marquee = overflow > 2 ? 'true' : 'false';
    event.currentTarget.style.setProperty('--title-shift', `${-overflow}px`);
  };
  if (!image?.trim()) return null;
  return (
    <article
      className={`${styles.card} ${variant === 'catalog' ? styles.card_catalog : ''} ${variant === 'search' ? styles.card_search : ''}`}
    >
      <Link to={productPath} className={styles.card__header} aria-label={`Открыть товар ${title}`}>
        <Image src={image} alt={title} className={styles.card__image} />
      </Link>

      <div className={styles.card__body}>
        <div className={styles.card__information}>
          <Link
            to={productPath}
            className={styles.card__information_title}
            title={title}
            onMouseEnter={prepareTitleMarquee}
          >
            <span ref={titleRef} className={styles.card__information_titleText}>
              {title}
            </span>
          </Link>
          {showSizes && variant !== 'search' && <ProductCardSizes sizes={sizes} />}
        </div>
        {showPurchase && (
          <div className={styles.card__purchase}>
            <span className={styles.card__price}>{price}</span>
            <button
              type="button"
              className={styles.card__quickBuy}
              onClick={() => setQuickBuyOpen(true)}
              disabled={!canBuy}
              aria-label={`Выбрать параметры и добавить в корзину: ${title}`}
            >
              В корзину
            </button>
          </div>
        )}
      </div>
      {showPurchase && quickBuyOpen && (
        <ProductQuickBuy
          slug={slug || slugifyCatalogValue(title)}
          sectionSlug={sectionSlug || 'catalog'}
          fallbackPrice={price}
          title={title}
          onClose={() => setQuickBuyOpen(false)}
        />
      )}
    </article>
  );
};
export default ProductCard;
