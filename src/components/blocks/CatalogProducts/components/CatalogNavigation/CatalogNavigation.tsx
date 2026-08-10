import { useNavigate } from 'react-router-dom';

import styles from './CatalogNavigation.module.scss';

export type CatalogNavigationItem = {
  slug: string;
  title: string;
  sectionIds: number[];
};

type CatalogNavigationProps = {
  activeSlug: string;
  items: CatalogNavigationItem[];
};

const CatalogNavigation = ({ activeSlug, items }: CatalogNavigationProps) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navigation} aria-label="Разделы каталога">
      {items.map((item, index) => {
        const isActive = activeSlug === item.slug;

        return (
          <button
            key={`${item.slug}-${item.sectionIds.join('-') || 'all'}-${index}`}
            type="button"
            className={`${styles.navigation__item} ${
              isActive ? styles.navigation__item_active : ''
            }`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(`/catalog/${item.slug}`)}
          >
            {item.title}
          </button>
        );
      })}
    </nav>
  );
};

export default CatalogNavigation;
