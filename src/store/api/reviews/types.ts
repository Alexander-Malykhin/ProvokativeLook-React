export interface ForumReviewItem {
    id: number;
    authorId: number;
    author: string;
    text: string;
    date: string;
    approved: boolean;
}
export interface ReviewsResponse {
    items: ForumReviewItem[];
    canCreate: boolean;
    currentUserId: number | null;
}
export interface CreateReviewRequest {
    text: string;
}
export interface CreateReviewResponse {
    success: boolean;
    review: ForumReviewItem;
}


export interface ReviewStatusResponse {
    forumModule: boolean;
    canCreate: boolean;
    currentUserId?: number | null;
}
