import { httpClient } from "./axios.ts";
import type { passwordData, passwordResponse, userData, UserInfoResponse } from "../type/user.ts";

export const updateUserInfo = async (data:userData) => {
    const response = await httpClient.put<UserInfoResponse>('/users/me',data)
    return response.data;
}

export const updatePassword = async (data:passwordData)=>{
    const response = await httpClient.patch<passwordResponse>('/users/me/password',data)
    return response.data;
}