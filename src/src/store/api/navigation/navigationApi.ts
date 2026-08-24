import { baseApi } from "@store/api/baseApi";
import type { NavigationResponse } from "@store/api/navigation/types";
const filterNavigation = (response: NavigationResponse): NavigationResponse => response.filter((item) => {
    const code = String(item.code ?? "").trim().toLowerCase();
    const title = String(item.title ?? "").trim().toLocaleLowerCase("ru-RU");
    return code !== "sale" && title !== "распродажа";
});
export const navigationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNavigation: builder.query<NavigationResponse, void>({
            query: () => "navigation",
            transformResponse: (response: NavigationResponse) => filterNavigation(Array.isArray(response) ? response : []),
        }),
    }),
});
export const { useGetNavigationQuery } = navigationApi;

