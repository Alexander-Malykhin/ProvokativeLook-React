import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//constants
import {API_BASE_URL} from '@store/constants.ts';
//types
import type { HomeResponse } from '@store/api/home/types.ts';

export const homeApi = createApi({
    reducerPath: 'homeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getHome: builder.query<HomeResponse, void>({
            query: () => 'home',
        }),
    }),
});

export const { useGetHomeQuery } = homeApi;