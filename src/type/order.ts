export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface CreateOrderRequest {
    adultNum: number;
    checkInDate: string; // ISO 8601 형식
    checkOutDate: string;
    childrenNum: number;
    recipientName: string;
    recipientPhone: string;
    items: {
        roomTypeId: number;
        quantity: number;
    }[];
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

export interface OrderHistoryItem {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: string;
    recipientName: string;
    checkInDate: string;
    checkOutDate: string;
    items: {
        id: number;
        roomType: {
            id: number;
            name: string;
            image: string;
        };
        quantity: number;
        price: number;
    }[];
}

export interface OrderListResponse {
    data: OrderHistoryItem[];
    pagination: Pagination;
}