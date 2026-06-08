import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//types
import type { ContactsResponse } from '@store/api/contacts/types';

export const contactsApi = createApi({
    reducerPath: 'contactsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/local/api/index.php?route=',
    }),
    endpoints: (builder) => ({
        getContacts: builder.query<ContactsResponse, void>({
            query: () => 'contacts',
        }),
    }),
});

export const { useGetContactsQuery } = contactsApi;