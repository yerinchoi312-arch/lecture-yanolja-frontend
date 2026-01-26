import type { UserResponse } from "./user.ts";

export interface UserData{
    data:UserResponse[];
    pagination:{
        totalUsers:number;
        totalPage:number;
        currentPage:number;
        limit:number;
    }
}

export interface CreateUser{
    username:string;
    name:string;
    email:string;
    password:string;
    phone:string;
    birthdate:string;
    gender:"MALE"|"FEMALE";
    role?:"ADMIN"|"USER";
}