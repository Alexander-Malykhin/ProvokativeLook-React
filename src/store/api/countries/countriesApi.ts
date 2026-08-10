import { baseApi } from "@store/api/baseApi";

export interface CountryItem {
  id: number;
  name: string;
  code: string;
  xmlId: string;
}

interface CountriesResponse {
  success: boolean;
  countries: CountryItem[];
}

export const countriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCountries: builder.query<CountriesResponse, { query?: string; limit?: number }>({
      query: ({ query = "", limit = 20 }) => ({
        url: "countries/search",
        scope: "site",
        params: { q: query, limit },
      }),
    }),
  }),
});

export const { useLazySearchCountriesQuery, useSearchCountriesQuery } = countriesApi;
