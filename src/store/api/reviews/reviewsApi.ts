import { baseApi } from "@store/api/baseApi";
import type { CreateReviewRequest, CreateReviewResponse, ReviewsResponse, ReviewStatusResponse, } from "./types";
export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewsResponse, void>({
            query: () => ({ url: "reviews" }),
            providesTags: ["Reviews"],
        }),
        getReviewStatus: builder.query<ReviewStatusResponse, void>({
            query: () => ({ url: "reviews/status" }),
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
export const { useGetReviewsQuery, useLazyGetReviewStatusQuery, useCreateReviewMutation } = reviewsApi;
