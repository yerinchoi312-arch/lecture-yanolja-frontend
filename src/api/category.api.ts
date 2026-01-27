import { httpClient } from "./axios.ts";
import type { CategoryResponse, SubCategoryResponse } from "../type/category.ts";

export const getCategories = async () => {
    const response = await httpClient.get<CategoryResponse>("/categories");
    return response.data;
}

export const getSubCategories = async (path:string,id:number) => {
    const response = await httpClient.get<SubCategoryResponse>(`/categories/${path}/${id}`);
    return response.data;
};
