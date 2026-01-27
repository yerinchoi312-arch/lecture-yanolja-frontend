import type { Category, SubCategory } from "./category.ts";

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

export type CreateCategoryResponse = AdminResponse<Category>;
export type CreateSubCategoryResponse = AdminResponse<SubCategory>;
