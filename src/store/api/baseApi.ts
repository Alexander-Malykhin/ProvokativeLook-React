import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { SITE_API_BASE_URL } from "@/config/env";

const rawBaseQuery = fetchBaseQuery();

const siteBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = (args, api, extraOptions) => {
  const request: FetchArgs = typeof args === "string" ? { url: args } : args;
  const route = request.url.replace(/^\//, "");

  return rawBaseQuery(
    {
      ...request,
      url: `${SITE_API_BASE_URL}${route}`,
      credentials: request.credentials ?? "include",
      cache: "no-store",
    },
    api,
    extraOptions,
  );
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: siteBaseQuery,
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
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
