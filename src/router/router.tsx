import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import CategoryDetailPage from "../category/CategoryDetailPage.tsx";
import Mypage from "../mypage/MyPage.tsx";
import EventDetailPage from "../event/EventDetailPage.tsx";

export const router = createBrowserRouter([
    {
        path:"",
        element:<Layout/>,
        children:[
            {index:true, element:<Home/>},
            {path:"/login", element:<Login/>},
            {path:"/mypage", element:<Mypage/>},
            {path:"/register", element:<Register/>},
            {path:"/category/:id", element:<CategoryDetailPage/>},
            {path:"/event",element:<EventDetailPage/>},
        ]
    }
]);