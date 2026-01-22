import type { LoginFromType, LoginResponse, RegisterFromType, UserResponse } from "../type/user.ts";
import { httpClient } from "./axios.ts";

export const registerUser = async (data: RegisterFromType) => {
    const response = await httpClient.post<{ message: string; data: UserResponse }>(
        "/auth/register",
        data,
    );
    return response.data;
};

export const loginUser = async (data: LoginFromType) => {
    const response = await httpClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};
