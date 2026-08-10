import { baseApi } from '@store/api/baseApi';
import type {
  CatalogProductsResponse,
  CatalogProductResponse,
  GetCatalogProductsRequest,
  GetCatalogProductRequest,
  CatalogSearchResponse,
  CatalogSearchRequest,
} from '@store/api/catalog/types';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogProducts: builder.query<
      CatalogProductsResponse,
      GetCatalogProductsRequest
    >({
      query: ({
        sectionIds = [],
        sizes = [],
        colors = [],
        minPrice = null,
        maxPrice = null,
        sort = 'popular',
        limit = 12,
        offset = 0,
      }) => ({
        url: 'catalog/products',
        scope: 'site',
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
    searchCatalog: builder.query<CatalogSearchResponse, CatalogSearchRequest>({
      query: ({ q, limit = 20 }) => ({
        url: 'catalog/search',
        scope: 'site',
        params: { q, limit },
      }),
      keepUnusedDataFor: 30,
    }),
    getCatalogProduct: builder.query<
      CatalogProductResponse,
      GetCatalogProductRequest
    >({
      query: ({ id }) => ({
        url: 'catalog/product',
        scope: 'site',
        params: { id },
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetCatalogProductsQuery,
  useGetCatalogProductQuery,
  useSearchCatalogQuery,
} = catalogApi;
