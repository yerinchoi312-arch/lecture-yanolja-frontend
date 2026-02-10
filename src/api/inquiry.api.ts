import { httpClient } from "./axios.ts";
import type { Inquiry, InquiryResponse, MyInquiry } from "../type/inquiry.ts";

export const CreateInquiries = async (title: string, content: string, type: string) => {
    const response = await httpClient.post<InquiryResponse>("/inquiries", { title,content,  type });
    return response.data;
};

export const FetchMyInquiries = async (page = 1, limit = 10) => {
    const response = await httpClient.get<MyInquiry>("/inquiries", {
        params: { page, limit },
    });
    return response.data;
};
export const InquiryDetail = async (InquiryId: string) => {
    const response = await httpClient.get<Inquiry>(`/inquiries/${InquiryId}`);
    return response.data;
};
export const updateInquiry = async (InquiryId: string) => {
    const response = await httpClient.put<Inquiry>(`/inquiries/${InquiryId}`);
    return response.data;
}
export const DeleteInquiry = async (InquiryId: string) => {
    const response = await httpClient.delete(`/inquiries/${InquiryId}`);
    return response.data;
}