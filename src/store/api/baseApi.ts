import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { API_BASE_URL, SITE_API_BASE_URL } from "@/config/env";

export type ApiScope = "web" | "site";

export type ScopedFetchArgs = FetchArgs & {
  scope?: ApiScope;
};

const rawBaseQuery = fetchBaseQuery();

const scopedBaseQuery: BaseQueryFn<
  string | ScopedFetchArgs,
  unknown,
  FetchBaseQueryError
> = (args, api, extraOptions) => {
  const scopedRequest: ScopedFetchArgs =
    typeof args === "string" ? { url: args } : args;
  const { scope = "web", ...request } = scopedRequest;
  const baseUrl = scope === "site" ? SITE_API_BASE_URL : API_BASE_URL;
  const route = request.url.replace(/^\//, "");

  return rawBaseQuery(
    {
      ...request,
      url: `${baseUrl}${route}`,
      credentials:
        request.credentials ?? "include",
    },
    api,
    extraOptions,
  );
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: scopedBaseQuery,
  tagTypes: [
    "User",
    "Addresses",
    "Cart",
    "Favorites",
    "RecentlyViewed",
    "Subscription",
    "Notifications",
    "Orders",
  ],
  endpoints: () => ({}),
});
