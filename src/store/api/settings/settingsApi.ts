import { baseApi } from '@store/api/baseApi';
import type { SettingsResponse } from '@store/api/settings/types';
import { IMAGE_BASE_URL } from '@/config/env';
const normalizeImage = (image: string | null): string | null => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image) || image.startsWith('data:')) {
    return image;
  }
  return `${IMAGE_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};
const normalizeSettings = (response: unknown): SettingsResponse => {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(response as SettingsResponse).map(([key, item]) => [
      key,
      item
        ? {
            ...item,
            image: normalizeImage(item.image),
          }
        : item,
    ]),
  ) as SettingsResponse;
};
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => 'settings',
      transformResponse: (response: unknown) => normalizeSettings(response),
    }),
  }),
});
export const { useGetSettingsQuery } = settingsApi;
