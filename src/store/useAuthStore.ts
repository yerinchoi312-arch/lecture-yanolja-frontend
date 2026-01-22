import { persist } from "zustand/middleware";
import type { UserResponse } from "../type/user.ts";
import { create } from "zustand";

interface AuthState{
    isLoggedIn:boolean;
    token:string | null;
    user:UserResponse | null;
    login:(token:string,user:UserResponse) => void;
    logout:() => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set=>({
            isLoggedIn:false,
            token:null,
            user:null,
            login:(token,user)=>set({isLoggedIn:true,token,user}),
            logout:()=>set({isLoggedIn:false,token:null,user:null})
        }),{name:"auth-storage"}
    )
)