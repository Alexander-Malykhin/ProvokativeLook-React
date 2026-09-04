import { baseApi } from '@store/api/baseApi';
import type { FavoriteMutationRequest, FavoriteMutationResponse, FavoritesResponse } from './types';

export const favoritesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFavorites: builder.query<FavoritesResponse, void>({
            query: () => ({ url: 'favorites' }),
            providesTags: ['Favorites'],
            keepUnusedDataFor: 120,
        }),
        addFavorite: builder.mutation<FavoriteMutationResponse, FavoriteMutationRequest>({
            query: (body) => ({ url: 'favorites/add', method: 'POST', body }),
            async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
                const patch = dispatch(favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                    draft.ids ??= draft.items.map((item) => item.id);
                    if (!draft.ids.includes(productId)) draft.ids.unshift(productId);
                    draft.count = draft.ids.length;
                }));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                        draft.ids = data.ids;
                        draft.count = data.count;
                    }));
                } catch {
                    patch.undo();
                }
            },
        }),
        removeFavorite: builder.mutation<FavoriteMutationResponse, FavoriteMutationRequest>({
            query: (body) => ({ url: 'favorites/remove', method: 'POST', body }),
            async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
                const patch = dispatch(favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                    draft.ids ??= draft.items.map((item) => item.id);
                    draft.ids = draft.ids.filter((id) => id !== productId);
                    draft.items = draft.items.filter((item) => item.id !== productId);
                    draft.count = draft.ids.length;
                }));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                        draft.ids = data.ids;
                        draft.items = draft.items.filter((item) => data.ids.includes(item.id));
                        draft.count = data.count;
                    }));
                } catch {
                    patch.undo();
                }
            },
        }),
        clearFavorites: builder.mutation<FavoritesResponse, void>({
            query: () => ({ url: 'favorites/clear', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const patch = dispatch(favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                    draft.items = [];
                    draft.ids = [];
                    draft.count = 0;
                }));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(favoritesApi.util.upsertQueryData('getFavorites', undefined, data));
                } catch {
                    patch.undo();
                }
            },
        }),
    }),
});

export const { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation, useClearFavoritesMutation } = favoritesApi;
