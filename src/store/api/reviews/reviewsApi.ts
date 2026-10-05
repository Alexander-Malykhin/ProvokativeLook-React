import { baseApi } from "@store/api/baseApi";
import type { CreateReviewRequest, CreateReviewResponse, ReviewsResponse, ReviewStatusResponse, } from "./types";
export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewsResponse, number | void>({
            query: (productId) => ({ url: "reviews", params: { productId: productId || undefined }, timeout: 15000 }),
            providesTags: ["Reviews", "User"],
        }),
        getReviewStatus: builder.query<ReviewStatusResponse, number>({
            query: (productId) => ({ url: "reviews/status", params: { productId }, timeout: 15000 }),
        }),
        createReview: builder.mutation<CreateReviewResponse, CreateReviewRequest>({
            query: ({ text, productId, photos }) => {
                const body = new FormData();
                body.append("text", text);
                body.append("productId", String(productId));
                photos.forEach((file) => body.append("photos[]", file));
                return ({
                url: "reviews",
                method: "POST",
                body,
                });
            },
            invalidatesTags: ["Reviews"],
        }),
    }),
});
export const { useGetReviewsQuery, useLazyGetReviewStatusQuery, useCreateReviewMutation } = reviewsApi;
