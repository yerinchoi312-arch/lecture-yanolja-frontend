import { Outlet } from "react-router";
import { twMerge } from "tailwind-merge";

function AdminLayout() {
    return (
        <div className={twMerge(["min-h-screen",["bg-blue-100"]])}>
            <header className={twMerge(["px-4","py-8","border-b","border-blue-400","bg-blue-400"])}>
                <h1 className={"font-extrabold text-3xl text-gray-800"}>Yanolja Admin</h1>
                <nav>

                </nav>
                <main><Outlet/></main>
            </header>

        </div>
    );
}
export default AdminLayout;
