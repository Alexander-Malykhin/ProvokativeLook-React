import { baseApi } from "@store/api/baseApi";
import type {
  AddCartItemRequest,
  CartResponse,
  RemoveCartItemRequest,
  UpdateCartItemRequest,
} from "@store/api/cart/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "cart",
        scope: "site",
      }),
      providesTags: ["Cart"],
    }),

    addCartItem: builder.mutation<CartResponse, AddCartItemRequest>({
      query: ({ productId, quantity = 1 }) => ({
        url: "cart/add",
        scope: "site",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<CartResponse, UpdateCartItemRequest>({
      query: ({ id, quantity }) => ({
        url: "cart/update",
        scope: "site",
        method: "POST",
        body: { id, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<CartResponse, RemoveCartItemRequest>({
      query: ({ id }) => ({
        url: "cart/remove",
        scope: "site",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<CartResponse, void>({
      query: () => ({
        url: "cart/clear",
        scope: "site",
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
