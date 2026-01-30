import { httpClient } from "./axios";
import type { CategoryData } from "../type/category";
import type {
    CreateCategoryParams,
    CreateSubCategoryParams,
    CreateCategoryResponse,
    CreateSubCategoryResponse,
} from "../type/admin.category";

export const fetchCategories = async (): Promise<CategoryData[]> => {
    const response = await httpClient.get<{ data: CategoryData[] }>("/categories");
    return response.data.data;
};

// 2. 1차 카테고리 생성 (Multipart/form-data)
export const createCategory = async (
    params: CreateCategoryParams,
): Promise<CreateCategoryResponse> => {
    const formData = new FormData();
    formData.append("name", params.name);
    formData.append("path", params.path);
    formData.append("image", params.image);

    const response = await httpClient.post<CreateCategoryResponse>("/admin/categories", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const createSubCategory = async (
    params: CreateSubCategoryParams,
): Promise<CreateSubCategoryResponse> => {
    const response = await httpClient.post<CreateSubCategoryResponse>(
        "/admin/categories/sub",
        params,
    );
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await httpClient.delete(`/admin/categories/${id}`);
};

export const deleteSubCategory = async (id: number): Promise<void> => {
    await httpClient.delete(`/admin/categories/sub/${id}`);
};
