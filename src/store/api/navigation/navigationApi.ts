import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
//constants
import {API_BASE_URL} from '@store/constants.ts';
//types
import type {NavigationResponse} from "@store/api/navigation/types";

export const navigationApi = createApi({
    reducerPath: "navigationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getNavigation: builder.query<NavigationResponse, void>({
            query: () => "navigation",
        }),
    }),
});

export const {useGetNavigationQuery} = navigationApi;