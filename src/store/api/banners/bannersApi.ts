import { baseApi } from '@store/api/baseApi';
import type { BannerRoute, BannersResponse } from './types';

export const bannersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query<BannersResponse, BannerRoute>({
            query: (route) => ({ url: route }),
            keepUnusedDataFor: 300,
        }),
    }),
});
export const { useGetBannersQuery } = bannersApi;
