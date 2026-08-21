import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError, } from "@reduxjs/toolkit/query/react";
import { SITE_API_BASE_URL } from "@/config/env";
const rawBaseQuery = fetchBaseQuery();
const siteBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = (args, api, extraOptions) => {
    const request: FetchArgs = typeof args === "string" ? { url: args } : args;
    const route = request.url.replace(/^\//, "");
    return rawBaseQuery({
        ...request,
        url: `${SITE_API_BASE_URL}${route}`,
        credentials: request.credentials ?? "include",
        cache: "no-store",
        responseHandler: request.responseHandler ?? (async (response) => {
            const text = await response.text();
            if (!text.trim())
                return null;
            try {
                return JSON.parse(text);
            }
            catch {
                const markers = ["{\"success\"", "{\"error\""];
                let jsonStart = -1;
                for (const marker of markers) {
                    const index = text.lastIndexOf(marker);
                    if (index > jsonStart)
                        jsonStart = index;
                }
                if (jsonStart >= 0) {
                    return JSON.parse(text.slice(jsonStart));
                }
                throw new Error(text);
            }
        }),
    }, api, extraOptions);
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
        "Reviews",
    ],
    endpoints: () => ({}),
});

