export type Gender = "MALE" | "FEMALE";
export type Role = "USER" | "ADMIN";

export interface RegisterFromType {
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    birthdate: string;
    gender: Gender;
}

export interface UserResponse {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    gender: Gender;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface UserInfoResponse {
    message: string;
    data: UserResponse;
}

export interface LoginFromType {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    data: {
        token: string;
        user: UserResponse;
    };
}

export interface userData{
    birthdate: string;
    name: string;
    phone: string;
}
export interface passwordResponse {
    message: string;
}
export interface passwordData{
    currentPassword : string;
    newPassword : string;
    newPasswordConfirm: string;
}

