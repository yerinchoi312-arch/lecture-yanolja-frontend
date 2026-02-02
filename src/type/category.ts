//카테고리 메뉴 조회
import type { RoomType } from "./product.ts";

export interface CategoryResponse {
    message: string;
    data: CategoryData[];
}
export interface CategoryData {
    id: number;
    name: string;
    path: string;
    image: string;
    subCategories: SubCategoryData[];
}
export interface SubCategoryData {
    id: number;
    name: string;
    categoryId: number;
}
//2차 카테고리 상세 조회 (상품 포함)
export interface SubCategoryResponseData {
    id: number;
    name: string;
    categoryId: number;
    category: {
        id: number;
        name: string;
        path: string;
    };
}
export interface SubCategoryResponseProduct {
    id: number;
    categoryId: number;
    subCategoryId: number;
    name: string;
    address: string;
    description: string;
    notice: string;
    images:string[];
    roomTypes:RoomType[];
    ratingAvg: number;
    reviewCount: number;
}
export interface SubCategoryResponse {
    message: string;
    data: SubCategoryResponseData[];
    product: SubCategoryResponseProduct[];
}
