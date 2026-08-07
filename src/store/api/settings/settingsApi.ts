import { baseApi } from "@store/api/baseApi";
//types
import type { SettingsResponse } from "@store/api/settings/types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => "settings",
    }),
  }),
});

export const { useGetSettingsQuery } = settingsApi;
