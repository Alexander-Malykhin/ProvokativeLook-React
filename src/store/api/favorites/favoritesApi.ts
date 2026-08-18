import { baseApi } from '@store/api/baseApi';
import type { FavoriteMutationRequest, FavoritesResponse } from './types';

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoritesResponse, void>({
      query: () => ({ url: 'favorites' }),
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation<FavoritesResponse, FavoriteMutationRequest>({
      query: (body) => ({ url: 'favorites/add', method: 'POST', body }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation<FavoritesResponse, FavoriteMutationRequest>({
      query: (body) => ({ url: 'favorites/remove', method: 'POST', body }),
      invalidatesTags: ['Favorites'],
    }),
    clearFavorites: builder.mutation<FavoritesResponse, void>({
      query: () => ({ url: 'favorites/clear', method: 'POST' }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useClearFavoritesMutation,
} = favoritesApi;
