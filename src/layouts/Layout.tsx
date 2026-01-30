import { Outlet } from "react-router";
import Header from "../pages/layout/Header.tsx";
import Footer from "../pages/layout/Footer.tsx";
import { twMerge } from "tailwind-merge";

function Layout() {
    return (
        <div className={twMerge(["flex","flex-col"],["min-h-screen"])}>
            <Header />
                <Outlet />
            <Footer />
        </div>
    );
}
export default Layout;
