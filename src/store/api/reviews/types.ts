export interface ForumReviewItem {
  id: number;
  authorId: number;
  author: string;
  text: string;
  date: string;
  approved: boolean;
  productId?: number | null;
  photos?: string[];
}
export interface ReviewsResponse {
  items: ForumReviewItem[];
  canCreate: boolean;
  currentUserId: number | null;
  productId?: number | null;
}
export interface CreateReviewRequest {
  text: string;
  productId: number;
  photos: File[];
}
export interface CreateReviewResponse {
  success: boolean;
  review: ForumReviewItem;
}

export interface ReviewStatusResponse {
  productId?: number | null;
  forumModule: boolean;
  canCreate: boolean;
  currentUserId?: number | null;
}
