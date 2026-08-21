import { baseApi } from "@store/api/baseApi";
import type { CreateReviewRequest, CreateReviewResponse, ReviewsResponse, } from "./types";
export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewsResponse, void>({
            query: () => ({ url: "reviews" }),
            providesTags: ["Reviews"],
        }),
        createReview: builder.mutation<CreateReviewResponse, CreateReviewRequest>({
            query: (body) => ({
                url: "reviews",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Reviews"],
        }),
    }),
});
export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi;

