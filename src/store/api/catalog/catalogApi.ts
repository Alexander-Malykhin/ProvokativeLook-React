import { baseApi } from '@store/api/baseApi';
import type {
  CatalogProductsResponse,
  CatalogProductResponse,
  GetCatalogProductsRequest,
  GetCatalogProductRequest,
  CatalogSearchResponse,
  CatalogSearchRequest,
  CatalogSectionsResponse,
  FeaturedProductsResponse,
  FeaturedProductType,
} from '@store/api/catalog/types';
export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogSections: builder.query<CatalogSectionsResponse, void>({
      query: () => ({ url: 'catalog' }),
      keepUnusedDataFor: 300,
    }),
    getCatalogProducts: builder.query<CatalogProductsResponse, GetCatalogProductsRequest>({
      query: ({
        sectionIds = [],
        sizes = [],
        colors = [],
        minPrice = null,
        maxPrice = null,
        sort = 'popular',
        limit = 20,
        offset = 0,
      }) => ({
        url: 'catalog/products',
        params: {
          sectionIds: sectionIds.length ? sectionIds.join(',') : undefined,
          sizes: sizes.length ? sizes.join(',') : undefined,
          colors: colors.length ? colors.join(',') : undefined,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          sort,
          limit,
          offset,
        },
      }),
      keepUnusedDataFor: 60,
    }),
    getFeaturedProducts: builder.infiniteQuery<FeaturedProductsResponse, FeaturedProductType, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage, _pages, lastCursor, cursors) => {
          const next = lastPage.pagination?.nextCursor;
          return lastPage.pagination?.hasMore && next && next !== lastCursor && !cursors.includes(next)
            ? next
            : undefined;
        },
      },
      query: ({ queryArg: type, pageParam: cursor }) => ({
        url: 'catalog/featured',
        params: { type, limit: 10, cursor: cursor ?? undefined },
      }),
      keepUnusedDataFor: 60,
    }),
    searchCatalog: builder.query<CatalogSearchResponse, CatalogSearchRequest>({
      query: ({ q, limit = 20 }) => ({
        url: 'catalog/search',
        params: { q, limit },
      }),
      keepUnusedDataFor: 30,
    }),
    getCatalogProduct: builder.query<CatalogProductResponse, GetCatalogProductRequest>({
      query: ({ slug, sectionSlug }) => ({
        url: 'catalog/product',
        params: { slug, section: sectionSlug },
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});
export const {
  useGetCatalogSectionsQuery,
  useGetCatalogProductsQuery,
  useGetFeaturedProductsInfiniteQuery,
  useGetCatalogProductQuery,
  useSearchCatalogQuery,
} = catalogApi;
