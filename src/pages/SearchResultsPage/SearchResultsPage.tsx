import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogList from '@components/blocks/CatalogProducts/components/CatalogList/CatalogList';
import CatalogFilterButtons from '@components/blocks/CatalogProducts/components/CatalogFilterButtons/CatalogFilterButtons';
import CatalogFilter from '@components/blocks/CatalogProducts/components/CatalogFilter/CatalogFilter';
import Pagination from '@components/blocks/CatalogProducts/components/Pagination/Pagination';
import CatalogNavigation, {
  type CatalogNavigationItem,
} from '@components/blocks/CatalogProducts/components/CatalogNavigation/CatalogNavigation';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import { useGetCatalogSectionsQuery, useSearchCatalogQuery } from '@store/api/catalog/catalogApi';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import { useAppSelector } from '@store/hooks';
import type { CatalogFilters, CatalogProductItem, CatalogSort } from '@store/api/catalog/types';
import { slugifyCatalogValue } from '@/helpers/catalog';
import styles from './SearchResultsPage.module.scss';

const PAGE_SIZE = 18;
const EMPTY_FILTERS: CatalogFilters = { sizes: [], colors: [], minPrice: null, maxPrice: null };

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();
  return <SearchResults key={query} query={query} />;
};

const SearchResults = ({ query }: { query: string }) => {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<CatalogSort>('popular');
  const [page, setPage] = useState(1);
  const isFilterOpen = useAppSelector((state) => state.toggleFilter.active);
  const canSearch = query.length >= 2;
  const {
    currentData: data,
    isLoading,
    isFetching,
    error,
  } = useSearchCatalogQuery({ q: query, limit: 50 }, { skip: !canSearch });
  const { data: sectionsData } = useGetCatalogSectionsQuery();
  const products = useMemo(() => data?.products ?? [], [data?.products]);

  const navigationItems = useMemo<CatalogNavigationItem[]>(
    () => [
      { slug: 'all', title: 'СМОТРЕТЬ ВСЁ', sectionIds: [] },
      ...(sectionsData?.sections ?? []).map((section) => ({
        slug: slugifyCatalogValue(section.code || section.name),
        title: section.name.toLocaleUpperCase('ru-RU'),
        sectionIds: [section.id],
      })),
    ],
    [sectionsData?.sections],
  );

  const filterOptions = useMemo(() => {
    const sizes = Array.from(new Set(products.flatMap((product) => product.sizes ?? [])));
    const colors = Array.from(new Set(products.flatMap((product) => product.colors ?? [])));
    const prices = products.map((product) => product.price).filter((price): price is number => price !== null);
    return {
      sizes,
      colors,
      price: { min: prices.length ? Math.min(...prices) : null, max: prices.length ? Math.max(...prices) : null },
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (filters.sizes.length && !filters.sizes.some((size) => product.sizes.includes(size))) return false;
      if (filters.colors.length && !filters.colors.some((color) => product.colors.includes(color))) return false;
      if (filters.minPrice !== null && (product.price === null || product.price < filters.minPrice)) return false;
      if (filters.maxPrice !== null && (product.price === null || product.price > filters.maxPrice)) return false;
      return true;
    });
    if (sort === 'popular') result.sort((a, b) => Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller)));
    if (sort === 'new')
      result.sort((a, b) => {
        const featured = Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        return featured !== 0 ? featured : b.id - a.id;
      });
    if (sort === 'priceAsc') result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'priceDesc') result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    return result;
  }, [products, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts: CatalogProductItem[] = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SectionLayout className={styles.searchResults}>
        <MainLayoutContainer className={styles.searchResults__content}>
          <div className={styles.searchResults__header}>
            <h1>Результаты поиска</h1>
            {canSearch && (
              <p>
                По запросу «{query}» найдено: <strong>{filteredProducts.length}</strong>
              </p>
            )}
          </div>
          <div className={styles.searchResults__layout}>
            <CatalogNavigation activeSlug="all" items={navigationItems} />
            <div className={styles.searchResults__products}>
              <CatalogFilterButtons
                sort={sort}
                options={filterOptions}
                onSortChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
              />
              {canSearch ? (
                <CatalogList
                  products={visibleProducts}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  errorMessage={error ? getRequestErrorMessage(error, 'Не удалось выполнить поиск') : null}
                />
              ) : (
                <div className={styles.searchResults__empty}>Введите минимум 2 символа для поиска.</div>
              )}
              {!isLoading && !error && filteredProducts.length > PAGE_SIZE && (
                <Pagination
                  page={currentPage}
                  total={filteredProducts.length}
                  pageSize={PAGE_SIZE}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </MainLayoutContainer>
      </SectionLayout>
      {isFilterOpen && (
        <CatalogFilter
          productsCount={filteredProducts.length}
          options={filterOptions}
          value={filters}
          sort={sort}
          onChange={(value) => {
            setFilters(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
          onReset={() => setPage(1)}
        />
      )}
    </>
  );
};

export default SearchResultsPage;
