import { baseApi } from "@store/api/baseApi";
//types
import type { NavigationResponse } from "@store/api/navigation/types";

export const navigationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNavigation: builder.query<NavigationResponse, void>({
      query: () => "navigation",
    }),
  }),
});

export const { useGetNavigationQuery } = navigationApi;
