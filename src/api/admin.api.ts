import type { UserData } from "../type/admin.ts";
import { httpClient } from "./axios.ts";

export const adminUser = async (page=1)=>{
    const response = await httpClient.get<UserData[]>('/admin/users',{
        params:{page}
    })
    return response.data;
}