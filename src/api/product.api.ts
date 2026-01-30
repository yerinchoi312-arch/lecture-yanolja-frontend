import { httpClient } from "./axios.ts";
import type {
    Product,
    ProductListParams,
    ProductListResponse,
} from "../type/product.ts";

export const fetchProducts = async (params?: ProductListParams) => {
    const response = await httpClient.get<ProductListResponse>("/products", { params });
    return response.data;
};

export const fetchProductById = async (id: number) => {
    const response = await httpClient.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
};
