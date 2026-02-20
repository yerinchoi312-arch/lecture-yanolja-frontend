import { httpClient } from "./axios.ts";
import type { OrderItem, OrderListResponse, OrderState } from "../type/order.ts";

export const AdminOrderList = async (page: number = 1) => {
    const response = await httpClient.get<OrderListResponse>(`/admin/orders?page=${page}`);
    return response.data;
}
export const AdminOrderDetail = async (orderId: string) => {
    const response = await httpClient.get<{data: OrderItem }>(`/admin/orders/${orderId}`);
    return response.data;
}
export const AdminOrderUpdate = async (orderId: string, status: OrderState) => {
    const response = await httpClient.patch<OrderItem>(`/admin/orders/${orderId}/status`, {
        status: status
    });
    return response.data;
}