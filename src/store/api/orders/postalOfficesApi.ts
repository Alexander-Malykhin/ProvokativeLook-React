import { baseApi } from '@store/api/baseApi';

export interface PostalOffice {
    postalCode: string;
    city: string;
    region: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    available: boolean;
    workingHours: { day: number; from: string; to: string }[];
}
export const postalOfficesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postalOfficeCodes: builder.query<{ postalCodes: string[] }, { city: string; region?: string }>({
            query: (params) => ({ url: 'delivery/post-offices', params, timeout: 60000 }),
            keepUnusedDataFor: 3600,
        }),
        postalOffice: builder.query<{ office: PostalOffice }, string>({
            query: (postalCode) => ({ url: 'delivery/post-office', params: { postalCode }, timeout: 60000 }),
            keepUnusedDataFor: 3600,
        }),
    }),
});
export const { useLazyPostalOfficeCodesQuery, useLazyPostalOfficeQuery } = postalOfficesApi;
