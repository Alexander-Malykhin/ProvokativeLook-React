import { baseApi } from '@store/api/baseApi';
import type { LegalPageData } from './types';
export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalPage: builder.query<LegalPageData, string>({
      query: (pageCode) => ({
        url: 'legal-page',
        params: {
          code: pageCode,
        },
      }),
    }),
  }),
});
export const { useGetLegalPageQuery } = legalApi;
