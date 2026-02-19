import type { Pagination } from "./order.ts";

export interface Review {
    id: number;
    createdAt: string;
    content: string;
    rating: number;
    user: {
        name: string;
    };
    product: {
        id: number;
        name: string;
    };
    roomType: {
        id: number;
        name: string;
    };
    images: ReviewImage[];
}
export interface ReviewImage {
    id: number;
    url: string;
}
export interface ReviewResponse {
    data: Review[];
    pagination: Pagination;
}
export interface UpdateReviewResponse {
    content: string;
    rating: number;
    images: string[];
}
export interface CreateReviewResponse {
    roomTypeId: number;
    content: string;
    rating: number;
    images: string[];
}
export interface ReviewCheckResponse{
    hasReview: boolean;
    reviewId: number | null;
}
export type ReviewSort=  "latest" | "rating_desc" | "rating_asc"
