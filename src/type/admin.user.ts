import type { Gender, Role, UserResponse } from "./user.ts";

export interface AdminUserPaginationInfo {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}


export interface AdminUserListResponse {
    pagination: AdminUserPaginationInfo;
    data: UserResponse[];
}

export interface AdminUserListQuery {
    page?: number;
    limit?: number;
}

export interface AdminCreateUserParams {
    username: string;
    email: string;
    name: string;
    password: string;
    phone: string;
    birthdate: string;
    gender: Gender;
    role?: Role;
}

export interface AdminUpdateUserParams {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    birthdate?: string;
    gender?: Gender;
    role?: Role;
}
