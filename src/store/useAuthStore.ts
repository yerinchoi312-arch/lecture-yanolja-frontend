import { persist } from "zustand/middleware";
import type { UserResponse } from "../type/user.ts";
import { create } from "zustand";

interface AuthState{
    isLoggedIn:boolean;
    token:string | null;
    user:UserResponse | null;
    login:(token:string,user:UserResponse) => void;
    logout:() => void;
    updateUser:(user:Partial<UserResponse>)=>void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set=>({
            isLoggedIn:false,
            token:null,
            user:null,
            login:(token,user)=>set({isLoggedIn:true,token,user}),
            logout:()=>set({isLoggedIn:false,token:null,user:null}),
            updateUser:updatedData=>
                set(state => ({user: state.user ? {...state.user, ...updatedData}:null}))
        }),{name:"auth-storage"}
    )
)