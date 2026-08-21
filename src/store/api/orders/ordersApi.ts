import { baseApi } from "@store/api/baseApi";
import type { CreateOrderRequest, CreateOrderResponse, CreateOrderPaymentResponse, OrdersResponse, } from "./types";
export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrdersResponse, {
            limit?: number;
            offset?: number;
        } | void>({
            query: (params) => {
                const search = new URLSearchParams({
                    limit: String(params?.limit ?? 50),
                    offset: String(params?.offset ?? 0),
                });
                return {
                    url: `orders&${search.toString()}`,
                };
            },
            providesTags: ["Orders"],
        }),
        createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
            query: (body) => ({
                url: "orders/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders", "Notifications"],
        }),
        payOrder: builder.mutation<CreateOrderPaymentResponse, {
            orderId: number;
        }>({
            query: (body) => ({
                url: "orders/pay",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders"],
        }),
    }),
});
export const { useGetOrdersQuery, useCreateOrderMutation, usePayOrderMutation } = ordersApi;

