import { httpClient } from "./axios.ts";
import type { ReviewResponse } from "../type/review.ts";

export const adminFetchReviews = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    productId?: number | null;
    roomTypeId?: number | null;
    rating?: number | null;
}) => {
    const response = await httpClient.get<ReviewResponse>('admin/reviews', { params });
    return response.data;
};

export const adminDeleteReview = async (ReviewId:string) => {
    const response = await httpClient.delete(`admin/reviews/${ReviewId}`);
    return response.data;
}
