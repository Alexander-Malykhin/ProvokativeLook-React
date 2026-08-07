import { baseApi } from "@store/api/baseApi";

// types
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterConfirmRequest,
  RegisterConfirmResponse,
  RegisterRequest,
  RegisterResponse,
  UserResponse,
} from "@store/api/user/types.ts";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserResponse, void>({
      query: () => ({ url: "user", scope: "site" }),
      providesTags: ["User"],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "auth/login",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        scope: "site",
        method: "POST",
        body,
      }),
    }),

    confirmRegister: builder.mutation<
      RegisterConfirmResponse,
      RegisterConfirmRequest
    >({
      query: (body) => ({
        url: "auth/register/confirm",
        scope: "site",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "auth/logout",
        scope: "site",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useConfirmRegisterMutation,
  useLogoutMutation,
} = userApi;
