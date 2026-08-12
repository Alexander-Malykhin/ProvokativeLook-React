import styles from './CatalogList.module.scss';

import ProductCard from '@components/ProductCard/ProductCard.tsx';
import type { CatalogProductItem } from '@store/api/catalog/types';

type CatalogListProps = {
  products: CatalogProductItem[];
  isLoading: boolean;
  isFetching?: boolean;
  errorMessage?: string | null;
};

const SKELETON_COUNT = 6;

const formatPrice = (price: number | null, currency: string | null) => {
  if (price === null) {
    return 'Цена не указана';
  }

  const formatted = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(price);

  if (currency === 'RUB') {
    return `${formatted} ₽`;
  }

  return `${formatted} ${currency ?? ''}`.trim();
};

const CatalogSkeleton = () => (
  <div className={styles.list} aria-label="Загрузка товаров" aria-busy="true">
    {Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <div className={styles.skeleton} key={`catalog-skeleton-${index}`}>
        <div className={styles.skeleton__image} />
        <div className={styles.skeleton__body}>
          <div className={styles.skeleton__title} />
          <div className={styles.skeleton__sizes}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.skeleton__price} />
        </div>
      </div>
    ))}
  </div>
);

const CatalogList = ({
  products,
  isLoading,
  isFetching = false,
  errorMessage,
}: CatalogListProps) => {
  if (isLoading) {
    return <CatalogSkeleton />;
  }

  if (errorMessage) {
    return <div className={styles.list__message}>{errorMessage}</div>;
  }

  if (products.length === 0) {
    return <div className={styles.list__message}>Товары не найдены</div>;
  }

  return (
    <div className={styles.listWrap} aria-busy={isFetching}>
      <div className={styles.list}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            image={product.image ?? ""}
            price={formatPrice(product.price, product.currency)}
            sizes={product.sizes}
          />
        ))}
      </div>

      {isFetching && <div className={styles.listWrap__loadingBar} />}
    </div>
  );
};

export default CatalogList;
