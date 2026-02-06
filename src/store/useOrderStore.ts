import type { OrderItem } from "../type/order.ts";
import { create } from "zustand";

interface OrderState {
    orderItems: OrderItem[];
    setOrderItems: (items: OrderItem[]) => void;
    clearOrder: () => void;
    getTotalPrice: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orderItems: [],
    setOrderItems: items => set({ orderItems: items }),
    clearOrder: () => set({ orderItems: [] }),
    getTotalPrice: () => {
        return get().orderItems.reduce((acc, item) => {
            return acc + item.totalPrice;
        }, 0);
    },
}));
