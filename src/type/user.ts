export interface RegisterFromType{
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    birthdate: string;
    gender:"MALE"|"FEMALE"
}

export interface UserResponse{
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    gender:"MALE"|"FEMALE";
    role:"USER"|"ADMIN";
    createdAt: string;
    updatedAt: string;
}


export interface LoginFromType{
    username: string;
    password: string;
}

export interface LoginResponse{
    message: string;
    data: {
        token: string;
        user: UserResponse;
    }
}