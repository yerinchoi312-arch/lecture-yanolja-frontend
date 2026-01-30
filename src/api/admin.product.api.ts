import { httpClient } from "./axios";
import type {
    CreateProductParams,
    UpdateProductParams,
    UpdateRoomTypeParams,
} from "../type/admin.product.ts";
import type { Product } from "../type/product.ts";

export const createProduct = async (data: CreateProductParams) => {
    const response = await httpClient.post<Product>("/admin/products", data);
    return response.data;
};

export const updateProduct = async (id: number, data: UpdateProductParams) => {
    const response = await httpClient.put<Product>(`/admin/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await httpClient.delete(`/admin/products/${id}`);
};

export const updateRoomType = async (roomId: number, data: UpdateRoomTypeParams): Promise<void> => {
    await httpClient.put(`/admin/products/room-types/${roomId}`, data);
};

export const deleteRoomType = async (roomId: number): Promise<void> => {
    await httpClient.delete(`/admin/products/room-types/${roomId}`);
};
