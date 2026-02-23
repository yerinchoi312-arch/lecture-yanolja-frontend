import type { CategoryData, SubCategoryData } from "./category.ts";

export interface CreateCategoryParams {
    name: string;
    path: string;
    image: File;
}

export interface CreateSubCategoryParams {
    categoryId: number;
    name: string;
}

export interface AdminResponse<T> {
    message: string;
    data: T;
}

export type CreateCategoryResponse = AdminResponse<CategoryData>;
export type CreateSubCategoryResponse = AdminResponse<SubCategoryData>;
