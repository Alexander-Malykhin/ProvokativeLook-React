import { baseApi } from '@store/api/baseApi';
import type { BannerRoute, BannersResponse, MainBannersResponse } from './types';

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMainBanners: builder.query<MainBannersResponse, void>({
      query: () => ({ url: 'mainBanners', timeout: 15000 }),
      keepUnusedDataFor: 60,
    }),
    getBanners: builder.query<BannersResponse, BannerRoute>({
      query: (route) => ({ url: route, timeout: 15000 }),
      keepUnusedDataFor: 300,
    }),
  }),
});
export const { useGetBannersQuery, useGetMainBannersQuery } = bannersApi;
