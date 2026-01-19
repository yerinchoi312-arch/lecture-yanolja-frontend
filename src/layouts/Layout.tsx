import { Outlet } from "react-router";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { twMerge } from "tailwind-merge";

function Layout() {
    return (
        <div className={twMerge(["flex","flex-col"],["min-h-screen","max-w-[1200px]","mx-auto"])}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
export default Layout;
