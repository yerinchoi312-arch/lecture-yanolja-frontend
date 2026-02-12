import {httpClient} from "./axios.ts";
import type {
    CreateReviewCheck,
    CreateReviewResponse,
    Review,
    ReviewResponse,
    UpdateReviewResponse,
} from "../type/review.ts";

export const createReview = async (data:CreateReviewResponse) => {
    const response = await httpClient.post<Review>('/reviews', data);
    return response.data;
}

export const fetchReviews = async () => {
    const response = await httpClient.get<ReviewResponse>('/reviews');
    return response.data;
}
export const fetchReview = async (productId:number) => {
    const response = await httpClient.get<ReviewResponse>(`/reviews?productId=${productId}`);
    return response.data;
}

export const fetchMyReview = async (page=1,limit=10) => {
    const response = await httpClient.get('/reviews/me',{params:{page,limit}});
    return response.data;
}

export const updateReview = async (ReviewId:string, data:UpdateReviewResponse)=> {
    const response = await httpClient.put(`/reviews/${ReviewId}` , data);
    return response.data;
}

export const deleteReview = async (ReviewId:string) => {
    const response = await httpClient.delete(`/reviews/${ReviewId}`);
    return response.data;
}

export const createReviewCheck = async (roomTypeId : number)=> {
    const response = await httpClient.get<CreateReviewCheck>(`/reviews/check?${roomTypeId}`);
    return response.data;
}