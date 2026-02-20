export interface CreateOrderRequest {
    adultNum: number;
    checkInDate: string;
    checkOutDate: string;
    childrenNum: number;
    recipientName: string;
    recipientPhone: string;
    items: CreateOrderItems[];
}
export interface CreateOrderItems {
    roomTypeId: number;
    quantity: number;
}

export interface CreateOrderResponse {
    message: string;
    data: {
        orderId: number;
        totalPrice: number;
        orderName: string;
        customerEmail: string;
        customerName: string;
    };
}

export interface OrderListResponse {
    data: OrderItem[];
    pagination: Pagination;
}
export type OrderState = "PENDING" | "PAID" | "CANCELED";

export interface OrderItem {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: OrderState;
    adultNum: number;
    childrenNum: number;
    recipientName: string;
    recipientPhone:string;
    checkInDate: string;
    checkOutDate: string;
    items: OrderItems[];
}
export interface OrderItems {
    id: number;
    roomType: {
        id: number;
        name: string;
        image: string;
        product: {
            name: string;
            id:number
        };
    };
    quantity: number;
    price: number;
}
export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface ConfirmOrderRequest {
    paymentKey: string;
    orderId: string;
    amount: number;
}
export interface CancelOrderRequest {
    cancelReason: string;
}