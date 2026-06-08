import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//types
import type { NavigationResponse } from '@store/api/navigation/types';

export const navigationApi = createApi({
    reducerPath: 'navigationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/local/api/index.php?route=',
    }),
    endpoints: (builder) => ({
        getNavigation: builder.query<NavigationResponse, void>({
            query: () => 'navigation',
        }),
    }),
});

export const { useGetNavigationQuery } = navigationApi;