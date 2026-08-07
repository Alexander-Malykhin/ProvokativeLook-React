import { baseApi } from "@store/api/baseApi";
import {
  parseGeocoderResponse,
  parseSuggestResponse,
} from "@components/blocks/Profile/subpages/ProfileAddresses/lib/addressParsers";
import type {
  ParsedAddress,
  Suggestion,
} from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";

interface SuggestAddressRequest {
  city: string;
  query: string;
}

interface GeocodeAddressRequest {
  geocode: string;
  results?: number;
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddressSuggestions: builder.query<Suggestion[], SuggestAddressRequest>({
      query: ({ city, query }) => ({
        url: "address/suggest",
        scope: "site",
        params: {
          text: [city.trim(), query.trim()].filter(Boolean).join(", "),
        },
        responseHandler: "text",
      }),
      transformResponse: parseSuggestResponse,
    }),

    geocodeAddress: builder.query<ParsedAddress[], GeocodeAddressRequest>({
      query: ({ geocode, results = 1 }) => ({
        url: "address/geocode",
        scope: "site",
        params: { geocode, results },
        responseHandler: "text",
      }),
      transformResponse: parseGeocoderResponse,
    }),
  }),
});

export const { useLazyGeocodeAddressQuery, useLazyGetAddressSuggestionsQuery } =
  addressApi;
