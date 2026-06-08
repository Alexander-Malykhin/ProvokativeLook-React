import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// constants
import { API_BASE_URL } from '@store/constants.ts';
// types
import type { CategoriesResponse } from '@store/api/categories/types.ts';

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => 'categories',
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;