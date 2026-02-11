import { httpClient } from "./axios.ts";
import type {
    CancelOrderRequest,
    ConfirmOrderRequest,
    CreateOrderRequest,
    CreateOrderResponse,
    OrderItem,
    OrderListResponse,
} from "../type/order.ts";
interface OrderParams {
    page?: number;
    limit?: number;
}
export const fetchMyOrders = async (params:OrderParams) => {
    const response = await httpClient.get<OrderListResponse>("/orders", {
        params: params
    });
    return response.data;
};
export const createOrder = async (orderData: CreateOrderRequest) => {
    const response = await httpClient.post<CreateOrderResponse>("/orders", orderData);
    return response.data;
};



export const orderDetail = async (orderId: string) => {
    const response = await httpClient.get<{ data: OrderItem }>(`/orders/${orderId}`);
    return response.data;
}

export const confirmOrder = async (data:ConfirmOrderRequest) => {
    const response = await httpClient.post< { data: OrderItem }>(`/orders/confirm`,data);
    return response.data.data;
}

export const orderCancel = async (orderId: string,data:CancelOrderRequest) => {
    const response = await httpClient.post<{ data: OrderItem }>(`/orders/${orderId}/cancel`,{
        data:data
    });
    return response.data;
}