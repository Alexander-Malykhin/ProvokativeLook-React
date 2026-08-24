import { baseApi } from "@store/api/baseApi";
import type { LoginRequest, LoginResponse, LogoutResponse, RegisterConfirmRequest, RegisterConfirmResponse, RegisterRequest, RegisterResponse, UserResponse, UpdateUserRequest, PasswordResetRequest, PasswordResetConfirmRequest, PasswordResetResponse, } from "@store/api/user/types.ts";
export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<UserResponse, void>({
            query: () => ({ url: "user" }),
            providesTags: ["User"],
        }),
        updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
            query: (body) => ({
                url: "user/update",
                method: "POST",
                body,
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userApi.util.updateQueryData("getUser", undefined, (draft) => {
                        Object.assign(draft, data);
                    }));
                }
                catch {
                }
            },
            invalidatesTags: ["User", "Addresses"],
        }),
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User", "Cart", "Favorites", "Addresses", "Orders"],
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({
                url: "auth/register",
                method: "POST",
                body,
            }),
        }),
        confirmRegister: builder.mutation<RegisterConfirmResponse, RegisterConfirmRequest>({
            query: (body) => ({
                url: "auth/register/confirm",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User", "Cart", "Favorites", "Addresses", "Orders"],
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User", "Cart", "Favorites", "Addresses", "Orders"],
        }),
        requestPasswordReset: builder.mutation<PasswordResetResponse, PasswordResetRequest>({
            query: (body) => ({ url: "auth/password/request", method: "POST", body }),
        }),
        confirmPasswordReset: builder.mutation<PasswordResetResponse, PasswordResetConfirmRequest>({
            query: (body) => ({ url: "auth/password/confirm", method: "POST", body }),
        }),
    }),
});
export const { useGetUserQuery, useUpdateUserMutation, useLoginMutation, useRegisterMutation, useConfirmRegisterMutation, useLogoutMutation, useRequestPasswordResetMutation, useConfirmPasswordResetMutation, } = userApi;

