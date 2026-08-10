import { baseApi } from "@store/api/baseApi";

export interface SubscriptionRequest {
  email?: string;
  name?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscribed: boolean;
  email: string;
  message?: string;
  contactCreated?: boolean;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: "subscription/subscribe",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),

    unsubscribe: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: "subscription/unsubscribe",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),

    getSubscriptionStatus: builder.query<SubscriptionResponse, string | void>({
      query: (email) => ({
        url: "subscription/status",
        scope: "site",
        params: email ? { email } : undefined,
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useGetSubscriptionStatusQuery,
} = subscriptionApi;
