import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import styles from './CatalogProducts.module.scss';

import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';

import CatalogNavigation, {
  type CatalogNavigationItem,
} from './components/CatalogNavigation/CatalogNavigation';
import CatalogList from './components/CatalogList/CatalogList';
import Pagination from './components/Pagination/Pagination';
import CatalogFilterButtons from './components/CatalogFilterButtons/CatalogFilterButtons';
import CatalogFilter from './components/CatalogFilter/CatalogFilter';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { close as closeFilter } from '@store/slices/toggleFIlterSlice';
import { useGetCatalogProductsQuery } from '@store/api/catalog/catalogApi';
import { useGetCategoriesQuery } from '@store/api/categories/categoriesApi';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import type { CatalogFilters, CatalogSort } from '@store/api/catalog/types';
import { getCatalogCategory, CATALOG_CATEGORIES } from './catalogConfig';
import { getCatalogCategorySlug, normalizeCatalogTitle } from '@/helpers/catalog';
import type { CategoryItem } from '@store/api/categories/types';
import { catalogOrder } from '@pages/CatalogPage/data';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 12;

const EMPTY_FILTERS: CatalogFilters = {
  sizes: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
};

const EMPTY_FILTER_OPTIONS = {
  sizes: [],
  colors: [],
  price: {
    min: null,
    max: null,
  },
};

const ALL_NAVIGATION_ITEM: CatalogNavigationItem = {
  slug: 'all',
  title: 'СМОТРЕТЬ ВСЁ',
  sectionIds: [],
};

const FALLBACK_NAVIGATION: CatalogNavigationItem[] = CATALOG_CATEGORIES.map(
  ({ slug, title, sectionIds }) => ({ slug, title, sectionIds }),
);

const dedupeNavigationItems = (
  items: CatalogNavigationItem[],
): CatalogNavigationItem[] => {
  const unique = new Map<string, CatalogNavigationItem>();

  items.forEach((item) => {
    if (!unique.has(item.slug)) {
      unique.set(item.slug, item);
    }
  });

  return Array.from(unique.values());
};

const CatalogProducts = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const resolvedSlug = useMemo(() => {
    if (categorySlug) {
      return categorySlug;
    }

    return pathname.split('/').filter(Boolean).at(-1) ?? 'all';
  }, [categorySlug, pathname]);

  const { data: categoriesData } = useGetCategoriesQuery();

  const navigationItems = useMemo<CatalogNavigationItem[]>(() => {
    if (!categoriesData?.items?.length) {
      return dedupeNavigationItems(FALLBACK_NAVIGATION);
    }

    const apiItems = catalogOrder
      .map((id) => categoriesData.items.find((item) => item.id === id))
      .filter((item): item is CategoryItem => item !== undefined)
      .map((item) => ({
        slug: getCatalogCategorySlug(item),
        title: normalizeCatalogTitle(item.name).toLocaleUpperCase('ru-RU'),
        sectionIds: item.sectionIds,
      }));

    return dedupeNavigationItems([ALL_NAVIGATION_ITEM, ...apiItems]);
  }, [categoriesData]);

  const category = useMemo(() => {
    const fromApi = navigationItems.find((item) => item.slug === resolvedSlug);

    return fromApi ?? getCatalogCategory(resolvedSlug);
  }, [navigationItems, resolvedSlug]);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<CatalogSort>('popular');
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);

  const isFilterOpen = useAppSelector((state) => state.toggleFilter.active);

  useEffect(() => {
    setPage(1);
    setSort('popular');
    setFilters(EMPTY_FILTERS);
    dispatch(closeFilter());
  }, [category.slug, dispatch]);

  const offset = (page - 1) * PAGE_SIZE;
  const queryFilters = useDebouncedValue(filters, 250);

  const { data, isLoading, isFetching, error } = useGetCatalogProductsQuery({
    sectionIds: category.sectionIds,
    sizes: queryFilters.sizes,
    colors: queryFilters.colors,
    minPrice: queryFilters.minPrice,
    maxPrice: queryFilters.maxPrice,
    sort,
    limit: PAGE_SIZE,
    offset,
  });

  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const products = data?.products ?? [];
  const filterOptions = data?.filterOptions ?? EMPTY_FILTER_OPTIONS;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleFiltersChange = (nextFilters: CatalogFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleSortChange = (nextSort: CatalogSort) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <SectionLayout className={styles.category}>
      <MainLayoutContainer className={styles.category__content}>
        <CatalogNavigation
          activeSlug={category.slug}
          items={navigationItems}
        />

        <div className={styles.category__list}>
          <CatalogFilterButtons sort={sort} onSortChange={handleSortChange} />

          <CatalogList
            products={products}
            isLoading={isLoading}
            isFetching={isFetching}
            errorMessage={
              error
                ? getRequestErrorMessage(
                    error,
                    'Не удалось получить товары каталога',
                  )
                : null
            }
          />
        </div>
      </MainLayoutContainer>

      {!isLoading && !error && total > 0 && (
        <Pagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}

      {isFilterOpen && (
        <CatalogFilter
          productsCount={total}
          options={filterOptions}
          value={filters}
          sort={sort}
          onChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onReset={() => setPage(1)}
        />
      )}
    </SectionLayout>
  );
};

export default CatalogProducts;
