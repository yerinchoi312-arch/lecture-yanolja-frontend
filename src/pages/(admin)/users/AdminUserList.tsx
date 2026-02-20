import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    FaTrash,
    FaEdit,
    FaUserCog,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { fetchUsers, deleteUserByAdmin } from "../../../api/admin.user.api";
import type { AdminUserPaginationInfo } from "../../../type/admin.user";
import type { UserResponse } from "../../../type/user.ts";

const AdminUserList = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserResponse[]>([]);
    const [pagination, setPagination] = useState<AdminUserPaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await fetchUsers({ page: currentPage, limit });

            setUsers(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error(error);
            alert("회원 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteUserByAdmin(id);
            alert("삭제되었습니다.");
            loadData(page).then(() => {});
        } catch (error) {
            alert("삭제 실패");
            console.log(error);
        }
    };

    const filteredUsers = users.filter(
        user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        if (pagination && page < pagination.totalPages) setPage(p => p + 1);
    };

    if (loading && page === 1) return <div className="p-8 text-center">로딩 중...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">회원 관리</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        총{" "}
                        <span className="font-bold text-blue-600">
                            {pagination?.totalUsers || 0}
                        </span>
                        명
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="이름, 아이디, 이메일 검색"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">회원 정보</th>
                                <th className="px-6 py-4">연락처/생년월일</th>
                                <th className="px-6 py-4">권한</th>
                                <th className="px-6 py-4">가입일</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium">#{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user.username}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span>{user.phone}</span>
                                                <span className="text-xs text-gray-400">
                                                    {user.birthdate} ({user.gender})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === "ADMIN" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <FaUserCog size={10} /> 관리자
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    일반회원
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition">
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition">
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-gray-400">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination && (
                <div className="flex justify-center items-center gap-4 py-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        <FaChevronLeft /> 이전
                    </button>
                    <span className="text-sm text-gray-600">
                        Page <span className="font-bold text-slate-800">{page}</span> of{" "}
                        {pagination.totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === pagination.totalPages}
                        className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        다음 <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUserList;
