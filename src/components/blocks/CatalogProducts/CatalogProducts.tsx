import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './CatalogProducts.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';
import CatalogNavigation, { type CatalogNavigationItem, } from './components/CatalogNavigation/CatalogNavigation';
import CatalogList from './components/CatalogList/CatalogList';
import Pagination from './components/Pagination/Pagination';
import CatalogFilterButtons from './components/CatalogFilterButtons/CatalogFilterButtons';
import CatalogFilter from './components/CatalogFilter/CatalogFilter';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { close as closeFilter } from '@store/slices/toggleFIlterSlice';
import { useGetCatalogProductsQuery, useGetCatalogSectionsQuery } from '@store/api/catalog/catalogApi';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import type { CatalogFilters, CatalogSort } from '@store/api/catalog/types';
import { slugifyCatalogValue } from '@/helpers/catalog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
const PAGE_SIZE = 18;
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

const FILTER_STATE_STORAGE_KEY = 'plCatalogFilterState';
type StoredCatalogFilterState = {
    slug: string;
    filters: CatalogFilters;
    sort: CatalogSort;
};
const readStoredFilterState = (slug: string): StoredCatalogFilterState | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.sessionStorage.getItem(FILTER_STATE_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<StoredCatalogFilterState>;
        if (parsed.slug !== slug || !parsed.filters || !parsed.sort) return null;
        return {
            slug,
            filters: {
                sizes: Array.isArray(parsed.filters.sizes) ? parsed.filters.sizes : [],
                colors: Array.isArray(parsed.filters.colors) ? parsed.filters.colors : [],
                minPrice: parsed.filters.minPrice ?? null,
                maxPrice: parsed.filters.maxPrice ?? null,
            },
            sort: parsed.sort,
        };
    } catch {
        return null;
    }
};
const writeStoredFilterState = (state: StoredCatalogFilterState) => {
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.setItem(FILTER_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // sessionStorage can be unavailable in privacy mode; in-memory state still works.
    }
};

const ALL_NAVIGATION_ITEM: CatalogNavigationItem = {
    slug: 'all',
    title: 'СМОТРЕТЬ ВСЁ',
    sectionIds: [],
};
const dedupeNavigationItems = (items: CatalogNavigationItem[]): CatalogNavigationItem[] => {
    const unique = new Map<string, CatalogNavigationItem>();
    items.forEach((item) => {
        if (!unique.has(item.slug)) {
            unique.set(item.slug, item);
        }
    });
    return Array.from(unique.values());
};
const CatalogProducts = () => {
    const { categorySlug } = useParams<{
        categorySlug: string;
    }>();
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const resolvedSlug = useMemo(() => {
        if (categorySlug) {
            return categorySlug;
        }
        return pathname.split('/').filter(Boolean).at(-1) ?? 'all';
    }, [categorySlug, pathname]);
    const { data: sectionsData } = useGetCatalogSectionsQuery();
    const topSections = sectionsData?.sections ?? [];
    const actualSection = useMemo(() => topSections.find((section) => slugifyCatalogValue(section.name) === resolvedSlug || slugifyCatalogValue(section.code) === resolvedSlug), [topSections, resolvedSlug]);
    const navigationItems = useMemo<CatalogNavigationItem[]>(() => {
        const sectionItems = topSections.map((section) => ({
            slug: slugifyCatalogValue(section.code || section.name),
            title: section.name.toLocaleUpperCase('ru-RU'),
            sectionIds: [section.id],
        }));
        return dedupeNavigationItems([ALL_NAVIGATION_ITEM, ...sectionItems]);
    }, [topSections]);
    const category = useMemo(() => {
        return (navigationItems.find((item) => item.slug === resolvedSlug) ??
            (actualSection ? { slug: resolvedSlug, title: actualSection.name, sectionIds: [actualSection.id] } : ALL_NAVIGATION_ITEM));
    }, [actualSection, navigationItems, resolvedSlug]);
    const initialStoredState = useMemo(() => readStoredFilterState(resolvedSlug), [resolvedSlug]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<CatalogSort>(() => initialStoredState?.sort ?? 'popular');
    const [filters, setFilters] = useState<CatalogFilters>(() => initialStoredState?.filters ?? EMPTY_FILTERS);
    const previousSectionSlug = useRef(resolvedSlug);
    const isFilterOpen = useAppSelector((state) => state.toggleFilter.active);

    useEffect(() => {
        if (previousSectionSlug.current === resolvedSlug) return;
        previousSectionSlug.current = resolvedSlug;
        setPage(1);
        setSort('popular');
        setFilters(EMPTY_FILTERS);
        writeStoredFilterState({ slug: resolvedSlug, filters: EMPTY_FILTERS, sort: 'popular' });
        dispatch(closeFilter());
    }, [resolvedSlug, dispatch]);

    useEffect(() => {
        writeStoredFilterState({ slug: resolvedSlug, filters, sort });
    }, [resolvedSlug, filters, sort]);
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
    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    return (<SectionLayout className={styles.category}>
      <MainLayoutContainer className={styles.category__content}>
        <CatalogNavigation activeSlug={category.slug} items={navigationItems}/>

        <div className={styles.category__list}>
          <CatalogFilterButtons sort={sort} options={filterOptions} onSortChange={handleSortChange}/>

          <CatalogList products={products} isLoading={isLoading} isFetching={isFetching} errorMessage={error
            ? getRequestErrorMessage(error, 'Не удалось получить товары каталога')
            : null}/>
        </div>
      </MainLayoutContainer>

      {!isLoading && !error && total > PAGE_SIZE && (<Pagination page={page} total={total} pageSize={PAGE_SIZE} totalPages={totalPages} onChange={handlePageChange}/>)}

      {isFilterOpen && (<CatalogFilter productsCount={total} options={filterOptions} value={filters} sort={sort} onChange={handleFiltersChange} onSortChange={handleSortChange} onReset={() => setPage(1)}/>)}
    </SectionLayout>);
};
export default CatalogProducts;
