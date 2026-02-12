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
export interface CreateReviewCheck{
    hasReview: boolean;
    reviewId: number | null;
}
