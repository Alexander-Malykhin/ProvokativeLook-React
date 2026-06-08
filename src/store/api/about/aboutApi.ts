import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//constants
import {API_BASE_URL} from '@store/constants.ts';
//types
import type {AboutResponse} from "@store/api/about/types.ts";


export const aboutApi = createApi({
    reducerPath: 'aboutApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getAbout: builder.query<AboutResponse, void>({
            query: () => 'about',
        }),
    }),
});

export const { useGetAboutQuery } = aboutApi;