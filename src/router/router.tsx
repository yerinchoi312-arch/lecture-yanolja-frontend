import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import CategoryListPage from "../pages/category/CategoryListPage.tsx";
import MyPage from "../pages/mypage/MyPage.tsx";
import EventDetailPage from "../pages/event/EventDetailPage.tsx";
import { useAuthStore } from "../store/useAuthStore.ts";
import AccountEdit from "../pages/mypage/AccountEdit.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminDashboard from "../pages/(admin)/AdminDashboard.tsx";
import AdminCategoryList from "../pages/(admin)/categories/AdminCategoryList.tsx";
import AdminCategoryCreate from "../pages/(admin)/categories/AdminCategoryCreate.tsx";
import AdminSubCategoryCreate from "../pages/(admin)/categories/AdminSubCategoryCreate.tsx";
import AdminUserList from "../pages/(admin)/users/AdminUserList.tsx";
import AdminUserEdit from "../pages/(admin)/users/AdminUserEdit.tsx";
import ReservationListPage from "../pages/reservation/ReservationListPage.tsx";
import InquiryList from "../pages/inquiry/InquiryList.tsx";
import FAQPage from "../pages/faq/FAQPage.tsx";
import Cart from "../pages/cart/Cart.tsx";
import AdminProductList from "../pages/(admin)/products/AdminProductList.tsx";
import AdminProductCreate from "../pages/(admin)/products/AdminProductCreate.tsx";
import AdminProductEdit from "../pages/(admin)/products/AdminProductEdit.tsx";
import InquiryWrite from "../pages/inquiry/InquiryWrite.tsx";
import EventListPage from "../pages/event/EventListPage.tsx";
import ProductDetailPage from "../pages/products/ProductDetailPage.tsx";
import SearchPage from "../pages/search/SearchPage.tsx";
import OrderDetail from "../pages/order/OrderDetail.tsx";
import OrderSuccess from "../pages/order/OrderSuccess.tsx";
import OrderFail from "../pages/order/OrderFail.tsx";
import ReservationDetailPage from "../pages/reservation/ReservationDetailPage.tsx";
import InquiryDetail from "../pages/inquiry/InquiryDetail.tsx";
import ReviewDetail from "../pages/review/ReviewDetail.tsx";
import AdminInquiryList from "../pages/(admin)/inquiry/AdminInquiryList.tsx";
import AdminInquiryDetail from "../pages/(admin)/inquiry/AdminInquiryDetail.tsx";
import InquiryEdit from "../pages/inquiry/InquiryEdit.tsx";
import AdminOrderList from "../pages/(admin)/orders/AdminOrderListPage.tsx";
import AdminOrderDetail from "../pages/(admin)/orders/AdminOrderDetailPage.tsx";
import AdminReviewList from "../pages/(admin)/reviews/AdminReviewList.tsx";
import AdminReviewDetail from "../pages/(admin)/reviews/AdminReviewDetail.tsx";
import MyReview from "../pages/mypage/MyReview.tsx";
import SubCategoryListPage from "../pages/category/SubCategoryListPage.tsx";

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
        path: "",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login />, loader: guestOnlyLoader },
            { path: "register", element: <Register />, loader: guestOnlyLoader },
            {
                path: "mypage",
                children: [
                    { index: true, element: <MyPage /> },
                    { path: "edit", element: <AccountEdit /> },
                    { path: "review", element: <MyReview /> },
                ],
            },
            {
                path: "inquiry",
                children: [
                    { index: true, element: <InquiryList /> },
                    { path: "write", element: <InquiryWrite /> },
                    { path: ":id", element: <InquiryDetail /> },
                    { path: "edit/:id", element: <InquiryEdit /> },
                ],
            },
            { path: "faq", element: <FAQPage /> },
            { path: "categories",
                children:[
                    {path:":id/:subId", element: <CategoryListPage />},
                    {path:":id/:subId/list", element: <SubCategoryListPage />},
                ]
                 },
            { path: "products/:id", element: <ProductDetailPage /> },
            {
                path: "event",
                children: [
                    { index: true, element: <EventListPage /> },
                    { path: ":id", element: <EventDetailPage /> },
                ],
            },
            {
                path: "order",
                children: [
                    { index: true, element: <OrderDetail /> },
                    { path: "success", element: <OrderSuccess /> },
                    { path: "fail", element: <OrderFail /> },
                ],
            },
            {
                path: "review",
                children: [
                    { path: ":id", element: <ReviewDetail /> },
                ],
            },
            {
                path: "reservation",
                children: [
                    { index: true, element: <ReservationListPage /> },
                    { path: ":id", element: <ReservationDetailPage /> },
                ],
            },
            { path: "cart", element: <Cart /> },
            { path: "search", element: <SearchPage /> },
        ],
    },
    {
        path: "/admin",
        loader: adminOnlyLoader,
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            {
                path: "users",
                children: [
                    { index: true, element: <AdminUserList /> },
                    { path: "users/:id", element: <AdminUserEdit /> },
                ],
            },
            {
                path: "categories",
                children: [
                    { index: true, element: <AdminCategoryList /> },
                    { path: "new", element: <AdminCategoryCreate /> },
                    { path: "sub/:parentId", element: <AdminSubCategoryCreate /> },
                ],
            },
            {
                path: "products",
                children: [
                    { index: true, element: <AdminProductList /> },
                    { path: "new", element: <AdminProductCreate /> },
                    { path: ":id", element: <AdminProductEdit /> },
                ],
            },
            {
                path: "inquiries",
                children: [
                    { index: true, element: <AdminInquiryList /> },
                    { path: ":id", element: <AdminInquiryDetail /> },
                ],
            },
            {
                path: "orders",
                children: [
                    { index: true, element: <AdminOrderList /> },
                    { path: ":id", element: <AdminOrderDetail /> },
                ],
            },
            {
                path: "reviews",
                children: [
                    { index: true, element: <AdminReviewList /> },
                    { path: ":id", element: <AdminReviewDetail /> },
                ],
            },
        ],
    },
]);
