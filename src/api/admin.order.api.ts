import { httpClient } from "./axios.ts";
import type { OrderItem, OrderListResponse, OrderState } from "../type/order.ts";

export const AdminOrderList = async (page: number = 1) => {
    // 쿼리 스트링으로 page 값을 넘겨줍니다.
    // 예: /admin/orders?page=1&limit=10
    const response = await httpClient.get<OrderListResponse>(`/admin/orders?page=${page}`);
    return response.data;
}
export const AdminOrderDetail = async (orderId: string) => {
    const response = await httpClient.get<{data: OrderItem }>(`/admin/orders/${orderId}`);
    return response.data;
}
export const AdminOrderUpdate = async (orderId: string, status: OrderState) => {
    // 1. URL은 http://.../admin/orders/36 형태 (이미지 확인됨)
    // 2. 데이터는 반드시 { status: "PAID" } 처럼 객체로 감싸기
    const response = await httpClient.patch<OrderItem>(`/admin/orders/${orderId}/status`, {
        status: status
    });
    return response.data;
}