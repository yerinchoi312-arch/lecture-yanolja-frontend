import { httpClient } from "./axios.ts";
import type {
    CreateOrderRequest,
    CreateOrderResponse,
    OrderListResponse,
} from "../type/order.ts";

export const createOrder = async (orderData: CreateOrderRequest) => {
    const response = await httpClient.post<CreateOrderResponse>("/orders", orderData);
    return response.data;
};

export const fetchMyOrders = async (page: number = 1, limit: number = 10) => {
    const response = await httpClient.get<OrderListResponse>("/orders", {
        params: { page, limit },
    });
    return response.data;
};
