import { httpClient } from "./axios";
import type { UserResponse } from "../type/user";
import type {
    AdminUpdateUserParams,
    AdminUserListQuery,
    AdminUserListResponse,
} from "../type/admin.user.ts";

export const fetchUsers = async (params?: AdminUserListQuery) => {
    const response = await httpClient.get<AdminUserListResponse>("/admin/users", {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
        },
    });
    return response.data;
};

export const fetchUserById = async (id: number): Promise<UserResponse> => {
    const response = await httpClient.get<{ data: UserResponse }>(`/admin/users/${id}`);
    return response.data.data;
};

export const updateUserByAdmin = async (id: number, params: AdminUpdateUserParams): Promise<UserResponse> => {
    const response = await httpClient.put<{ data: UserResponse }>(`/admin/users/${id}`, params);
    return response.data.data;
};

export const deleteUserByAdmin = async (id: number): Promise<void> => {
    await httpClient.delete(`/admin/users/${id}`);
};
