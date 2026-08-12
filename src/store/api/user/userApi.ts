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
  UpdateUserRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PasswordResetResponse,
} from "@store/api/user/types.ts";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserResponse, void>({
      query: () => ({ url: "user", scope: "site" }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: "user/update",
        scope: "site",
        method: "POST",
        body,
      }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData("getUser", undefined, (draft) => {
              Object.assign(draft, data);
            }),
          );
        } catch {
          // Ошибка уже будет обработана вызывающим компонентом.
        }
      },
      invalidatesTags: ["User", "Addresses"],
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

    requestPasswordReset: builder.mutation<PasswordResetResponse, PasswordResetRequest>({
      query: (body) => ({ url: "auth/password/request", scope: "site", method: "POST", body }),
    }),

    confirmPasswordReset: builder.mutation<PasswordResetResponse, PasswordResetConfirmRequest>({
      query: (body) => ({ url: "auth/password/confirm", scope: "site", method: "POST", body }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useConfirmRegisterMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} = userApi;
