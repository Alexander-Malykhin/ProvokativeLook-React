import { createApi } from '@reduxjs/toolkit/query/react';
import { SITE_API_BASE_URL } from '@/config/env';
import { createSiteBaseQuery } from './requestPolicy';
const siteBaseQuery = createSiteBaseQuery(SITE_API_BASE_URL);
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: siteBaseQuery,
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: false,
  tagTypes: [
    'User',
    'Addresses',
    'Cart',
    'Favorites',
    'RecentlyViewed',
    'Subscription',
    'Notifications',
    'Orders',
    'Reviews',
  ],
  endpoints: () => ({}),
});
