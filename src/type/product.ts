import type { PaginationResponse } from "./common.ts";

export interface RoomType {
    id: number;
    name: string;
    description: string;
    image: string;
    originPrice: number;
    price: number;
}

export interface Product {
    id: number;
    categoryId: number;
    subCategoryId: number;

    name: string;
    address: string;
    description: string;
    notice: string;

    images: string[];

    roomTypes: RoomType[];
    ratingAvg: number;
    reviewCount: number;

    createdAt: string;
    updatedAt: string;
}

export interface ProductSummary {
    id: number;
    categoryId: number;
    subCategoryId: number;
    name: string;
    address: string;
    thumbnail: string;
    minPrice: number;
    ratingAvg: number;
    reviewCount: number;
}

export interface ProductListResponse {
    data: ProductSummary[];
    pagination: PaginationResponse;
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    subCategoryId?: number;
    keyword?: string;
}
