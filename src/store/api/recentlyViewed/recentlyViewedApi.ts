import { baseApi } from '@store/api/baseApi';
import type { GetRecentlyViewedRequest, RecentlyViewedResponse } from './types';

export const recentlyViewedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentlyViewed: builder.query<RecentlyViewedResponse, GetRecentlyViewedRequest | void>({
      query: (args) => ({
        url: 'recently-viewed',
        scope: 'site',
        params: {
          limit: args?.limit ?? 10,
          excludeId: args?.excludeId,
        },
      }),
      providesTags: ['RecentlyViewed'],
    }),
    addRecentlyViewed: builder.mutation<{ success: boolean }, { productId: number }>({
      query: (body) => ({ url: 'recently-viewed/add', scope: 'site', method: 'POST', body }),
      invalidatesTags: ['RecentlyViewed'],
    }),
    clearRecentlyViewed: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: 'recently-viewed/clear', scope: 'site', method: 'POST' }),
      invalidatesTags: ['RecentlyViewed'],
    }),
  }),
});

export const {
  useGetRecentlyViewedQuery,
  useAddRecentlyViewedMutation,
  useClearRecentlyViewedMutation,
} = recentlyViewedApi;
