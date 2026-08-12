import { baseApi } from "@store/api/baseApi";
import {
  parseGeocoderResponse,
  parseSuggestResponse,
} from "@components/blocks/Profile/subpages/ProfileAddresses/lib/addressParsers";
import type {
  ParsedAddress,
  ProfileAddress,
  Suggestion,
} from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";

interface SuggestAddressRequest {
  city?: string;
  query: string;
}

interface GeocodeAddressRequest {
  geocode: string;
  results?: number;
}


export interface PickupPoint {
  id: string;
  code: string;
  externalId?: string;
  name: string;
  address: string;
  postalCode: string;
  uri: string;
  distance?: number | null;
  source?: string;
}

interface PickupPointsResponse {
  success: boolean;
  city: string;
  provider: "cdek" | "mail";
  center: { latitude: number; longitude: number };
  points: PickupPoint[];
}

interface AddressesResponse {
  success: boolean;
  addresses: ProfileAddress[];
  address?: ProfileAddress;
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddressSuggestions: builder.query<Suggestion[], SuggestAddressRequest>({
      query: ({ city = "", query }) => ({
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

    getPickupPoints: builder.query<PickupPointsResponse, { city: string; provider: "cdek" | "mail"; country?: string; countryCode?: string }>({
      query: ({ city, provider, country = "", countryCode = "" }) => ({
        url: "address/pickup-points",
        scope: "site",
        params: { city, provider, country, countryCode },
      }),
    }),

    getAddresses: builder.query<AddressesResponse, void>({
      query: () => ({ url: "addresses", scope: "site" }),
      providesTags: ["Addresses"],
    }),

    addAddress: builder.mutation<AddressesResponse, ProfileAddress>({
      query: (body) => ({
        url: "addresses/add",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses", "User"],
    }),

    updateAddress: builder.mutation<AddressesResponse, ProfileAddress>({
      query: (body) => ({
        url: "addresses/update",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses", "User"],
    }),

    setDefaultAddress: builder.mutation<AddressesResponse, { id: number }>({
      query: (body) => ({
        url: "addresses/default",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses", "User"],
    }),

    deleteAddress: builder.mutation<AddressesResponse, { id: number }>({
      query: (body) => ({
        url: "addresses/delete",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses", "User"],
    }),
  }),
});

export const {
  useLazyGeocodeAddressQuery,
  useLazyGetPickupPointsQuery,
  useLazyGetAddressSuggestionsQuery,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
