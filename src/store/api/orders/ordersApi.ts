import { baseApi } from "@store/api/baseApi";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrdersResponse,
} from "./types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, { limit?: number; offset?: number } | void>({
      query: (params) => {
        const search = new URLSearchParams({
          limit: String(params?.limit ?? 50),
          offset: String(params?.offset ?? 0),
        });

        return {
          url: `orders&${search.toString()}`,
          scope: "site",
        };
      },
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: "orders/create",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders", "Cart", "Notifications"],
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
