import { baseApi } from "@store/api/baseApi";
import type { PostalQuote } from './types';
import type { CreateOrderRequest, CreateOrderResponse, CreateOrderPaymentResponse, OrdersResponse, } from "./types";
export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        resolvePostalCode: builder.mutation<{ success: boolean; address: { postalCode: string } }, { address: string }>({
            query: (body) => ({ url: 'delivery/quote', method: 'POST', body: { ...body, addressOnly: true }, timeout: 30000 }),
        }),
        quotePostalDelivery: builder.mutation<{ success: boolean; quote: PostalQuote }, { mode: 'office' | 'door'; postalCode: string; address: string }>({
            query: (body) => ({ url: 'delivery/quote', method: 'POST', body, timeout: 120000 }),
        }),
        payDelivery: builder.mutation<CreateOrderPaymentResponse, { orderId: number }>({
            query: (body) => ({ url: 'orders/delivery/pay', method: 'POST', body }),
            invalidatesTags: ['Orders'],
        }),
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
            invalidatesTags: ["Orders", "Notifications", "User"],
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
export const { useGetOrdersQuery, useCreateOrderMutation, usePayOrderMutation, useQuotePostalDeliveryMutation, usePayDeliveryMutation, useResolvePostalCodeMutation } = ordersApi;

