import { baseApi } from "@store/api/baseApi";
// types
import type { CategoriesResponse } from "@store/api/categories/types.ts";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
