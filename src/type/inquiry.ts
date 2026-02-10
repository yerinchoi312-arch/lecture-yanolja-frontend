import type { Pagination } from "./order.ts";

export interface InquiryResponse{
    data:Inquiry[];
    message:string;
}
export interface Inquiry{
    id: number;
    createdAt: string;
    updatedAt: string;
    type:InquiryType;
    title:string;
    content:string;
    status:"PENDING"|"ANSWERED";
    answer:string|null;
    answeredAt:string|null;
    images:InquiryImage[]
}
export type InquiryType =
    "RESERVATION" | "PRODUCT" | "EXCHANGE_RETURN" | "MEMBER" |"OTHER";

export interface InquiryImage{
    id: number;
    url:string;
}

export interface MyInquiry{
    data:Inquiry[];
    pagination:Pagination;
}