import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//types
import type {AboutResponse} from "@store/api/about/types.ts";


export const aboutApi = createApi({
    reducerPath: 'aboutApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/local/api/web/index.php?route=',
    }),
    endpoints: (builder) => ({
        getAbout: builder.query<AboutResponse, void>({
            query: () => 'about',
        }),
    }),
});

export const { useGetAboutQuery } = aboutApi;