import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import CategoryDetailPage from "../category/CategoryDetailPage.tsx";
import MyPage from "../mypage/MyPage.tsx";
import EventDetailPage from "../event/EventDetailPage.tsx";
import { useAuthStore } from "../store/useAuthStore.ts";
import AccountEdit from "../mypage/AccountEdit.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import PromotionPage from "../promotion/PromotionPage.tsx";

export const guestOnlyLoader = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if(isLoggedIn) {
        return redirect("/");
    }
    return null;
}

export const router = createBrowserRouter([
    {
        path:"",
        element:<Layout/>,
        children:[
            {index:true, element:<Home/>},
            {path:"/login", element:<Login/>,loader:guestOnlyLoader},
            {path:"/register", element:<Register/> ,loader:guestOnlyLoader},
            {path:"/mypage", element:<MyPage/>},
            {path:"/mypage/edit",element:<AccountEdit/>},
            {path:"/category/:id", element:<CategoryDetailPage/>},
            {path:"/event",element:<EventDetailPage/>},
            {path:"/promotion",element:<PromotionPage/>},
        ]
    },
    {
        path:"/admin",
        element: <AdminLayout/>,
    }
]);