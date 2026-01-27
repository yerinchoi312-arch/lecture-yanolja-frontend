import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import CategoryListPage from "../category/CategoryListPage.tsx";
import MyPage from "../mypage/MyPage.tsx";
import EventDetailPage from "../event/EventDetailPage.tsx";
import { useAuthStore } from "../store/useAuthStore.ts";
import AccountEdit from "../mypage/AccountEdit.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import PromotionPage from "../promotion/PromotionPage.tsx";
import AdminDashboard from "../pages/(admin)/AdminDashboard.tsx";
import AdminCategoryList from "../pages/(admin)/categories/AdminCategoryList.tsx";
import AdminCategoryCreate from "../pages/(admin)/categories/AdminCategoryCreate.tsx";
import AdminSubCategoryCreate from "../pages/(admin)/categories/AdminSubCategoryCreate.tsx";
import AdminUserList from "../pages/(admin)/users/AdminUserList.tsx";
import AdminUserEdit from "../pages/(admin)/users/AdminUserEdit.tsx";

export const guestOnlyLoader = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (isLoggedIn) {
        return redirect("/");
    }
    return null;
};

export const adminOnlyLoader = () => {
    const { isLoggedIn, user } = useAuthStore.getState();
    if (!isLoggedIn) {
        alert("관리자 로그인이 필요합니다.");
        return redirect("/login");
    }

    if (user?.role !== "ADMIN") {
        alert("접근 권한이 없습니다.");
        return redirect("/");
    }

    return null;
};

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
            {path:"/categories/:path", element:<CategoryListPage/>},
            {path:"/event",element:<EventDetailPage/>},
            {path:"/promotion",element:<PromotionPage/>},
        ]
    },
    {
        path: "/admin",
        loader: adminOnlyLoader,
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "categories", element: <AdminCategoryList /> },
            { path: "categories/new", element: <AdminCategoryCreate /> },
            { path: "categories/new/sub/:parentId", element: <AdminSubCategoryCreate /> },

            { path: "users", element: <AdminUserList /> },
            { path: "users/:id", element: <AdminUserEdit /> },
        ],
    },
]);