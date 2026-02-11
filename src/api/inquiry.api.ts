import { httpClient } from "./axios.ts";
import type {
    AnswerRequest,
    createInquiryResponse,
    Inquiry,
    InquiryResponse,
    MyInquiry,
} from "../type/inquiry.ts";

export const createInquiries = async (data:createInquiryResponse) => {
    const response = await httpClient.post<InquiryResponse>("/inquiries",data);
    return response.data;
};

export const fetchMyInquiries = async (page = 1, limit = 10) => {
    const response = await httpClient.get<MyInquiry>("/inquiries", {
        params: { page, limit },
    });
    return response.data;
};
export const inquiryDetail = async (InquiryId: string) => {
    const response = await httpClient.get<{data: Inquiry }>(`/inquiries/${InquiryId}`);
    return response.data;
};
export const updateInquiry = async (InquiryId: string,data:createInquiryResponse) => {
    const response = await httpClient.put<Inquiry>(`/inquiries/${InquiryId}`,data);
    return response.data;
}
export const deleteInquiry = async (InquiryId: string) => {
    const response = await httpClient.delete(`/inquiries/${InquiryId}`);
    return response.data;
}

export const adminInquiriesList = async () => {
    const response = await httpClient.get<InquiryResponse>("/admin/inquiries");
    return response.data;
}
export const adminInquiryDetail = async (InquiryId: string) => {
    const response = await httpClient.get<{data: Inquiry }>(`/admin/inquiries/${InquiryId}`);
    return response.data;
};
export const adminDeleteInquiry = async (InquiryId: string) => {
    const response = await httpClient.delete(`/admin/inquiries/${InquiryId}`);
    return response.data;
}
export const adminUpdateInquiry = async (InquiryId: string,data:AnswerRequest) => {
    const response = await httpClient.post(`/admin/inquiries/${InquiryId}/reply`, data, );
    return response.data;
};