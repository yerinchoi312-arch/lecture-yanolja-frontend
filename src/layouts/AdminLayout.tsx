import { Link, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore.ts";

const AdminLayout = () => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 사이드바 */}
            <aside className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-slate-700">관리자 센터</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-2 hover:bg-slate-700 rounded">
                        대시보드
                    </Link>
                    <Link to="/admin/users" className="block px-4 py-2 hover:bg-slate-700 rounded">
                        회원 관리
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="block px-4 py-2 hover:bg-slate-700 rounded">
                        카테고리 관리
                    </Link>
                    <Link
                        to="/admin/products"
                        className="block px-4 py-2 hover:bg-slate-700 rounded">
                        상품 관리
                    </Link>
                    <Link
                        to="/admin/inquiries"
                        className="block px-4 py-2 hover:bg-slate-700 rounded">
                        1:1문의 관리
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700 space-y-4">
                    <button
                        onClick={() => navigate("/")}
                        className={
                            "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                        }>
                        홈화면
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
