import { baseApi } from '@store/api/baseApi';
import type { InfoPagesResponse } from './types';

export const infoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryPaymentPages: builder.query<InfoPagesResponse, void>({
      query: () => ({
        url: 'delivery-payment-pages',
      }),
    }),
  }),
});

export const { useGetDeliveryPaymentPagesQuery } = infoApi;
