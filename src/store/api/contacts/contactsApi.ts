import { baseApi } from "@store/api/baseApi";
//types
import type { ContactsResponse } from "@store/api/contacts/types";

export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, void>({
      query: () => "contacts",
    }),
  }),
});

export const { useGetContactsQuery } = contactsApi;
