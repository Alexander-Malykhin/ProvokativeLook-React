import { baseApi } from "@store/api/baseApi";
//types
import type { AboutResponse } from "@store/api/about/types.ts";

export const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query<AboutResponse, void>({
      query: () => "about",
    }),
  }),
});

export const { useGetAboutQuery } = aboutApi;
