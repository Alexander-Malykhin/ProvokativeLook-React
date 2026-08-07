import { baseApi } from "@store/api/baseApi";
//types
import type { HomeResponse } from "@store/api/home/types.ts";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query<HomeResponse, void>({
      query: () => "home",
    }),
  }),
});

export const { useGetHomeQuery } = homeApi;
