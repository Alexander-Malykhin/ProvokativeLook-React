import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//constants
import {API_BASE_URL} from '@store/constants.ts';
//types
import type { ContactsResponse } from '@store/api/contacts/types';

export const contactsApi = createApi({
    reducerPath: 'contactsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getContacts: builder.query<ContactsResponse, void>({
            query: () => 'contacts',
        }),
    }),
});

export const { useGetContactsQuery } = contactsApi;