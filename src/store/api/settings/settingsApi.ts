import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//constants
import {API_BASE_URL} from '@store/constants.ts';
//types
import type { SettingsResponse } from '@store/api/settings/types';

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getSettings: builder.query<SettingsResponse, void>({
            query: () => 'settings',
        }),
    }),
});

export const { useGetSettingsQuery } = settingsApi;