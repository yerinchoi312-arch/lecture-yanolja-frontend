import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaTrash, FaFolder, FaFolderOpen, FaLink } from "react-icons/fa";
import {
    deleteCategory,
    deleteSubCategory,
    fetchCategories,
} from "../../../api/admin.category.api";
import type { Category } from "../../../type/category";

const AdminCategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
            alert("데이터 로드 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData().then(() => {});
    }, []);

    const handleDeleteCategory = async (id: number) => {
        if (
            !window.confirm(
                "정말 삭제하시겠습니까? 1차 카테고리 삭제 시 하위 카테고리도 모두 삭제됩니다.",
            )
        )
            return;
        try {
            await deleteCategory(id);
            loadData().then(() => {});
        } catch (error) {
            alert("삭제 실패");
            console.log(error);
        }
    };

    const handleDeleteSubCategory = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteSubCategory(id);
            loadData().then(() => {});
        } catch (error) {
            alert("삭제 실패");
            console.log(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">로딩 중...</div>;

    return (
        <div>
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">카테고리 관리</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        전체 카테고리 구조를 관리합니다. (총 {categories.length}개)
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/categories/new")}
                    className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded hover:bg-slate-700 transition shadow-sm">
                    <FaPlus /> 1차 카테고리 등록
                </button>
            </div>

            {/* 수평형 리스트 레이아웃 */}
            <div className="space-y-6">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow duration-300">
                        {/* 1. 좌측 이미지 영역 (고정 너비) */}
                        <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-gray-100">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                            />
                            {/* 이미지 위 오버레이 (삭제 버튼 등) */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition flex items-start justify-end p-2">
                                {/* 필요시 이미지 수정 버튼 등 배치 가능 */}
                            </div>
                        </div>

                        {/* 2. 중앙 1차 카테고리 정보 */}
                        <div className="w-full md:w-64 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 bg-white z-10">
                            <div>
                                <span className="text-xs font-bold text-blue-600 mb-1 block">
                                    Level 1
                                </span>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                                    <FaFolderOpen className="text-yellow-500" />
                                    {cat.name}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
                                    <FaLink size={10} />
                                    <span>/{cat.path}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-red-200 text-red-500 rounded hover:bg-red-50 text-sm transition">
                                <FaTrash size={12} /> 1차 카테고리 삭제
                            </button>
                        </div>

                        {/* 3. 우측 2차 카테고리 목록 */}
                        <div className="flex-1 p-6 bg-gray-50/50 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                    <FaFolder className="text-gray-400" /> 하위 카테고리
                                    <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                                        {cat.subCategories?.length || 0}
                                    </span>
                                </h4>
                                <button
                                    onClick={() => navigate(`/admin/categories/new/sub/${cat.id}`)}
                                    className="text-xs flex items-center gap-1 bg-white border border-gray-300 px-2 py-1 rounded hover:border-blue-500 hover:text-blue-600 transition shadow-sm">
                                    <FaPlus size={10} /> 추가
                                </button>
                            </div>

                            <div className="flex-1">
                                {cat.subCategories && cat.subCategories.length > 0 ? (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {cat.subCategories.map(sub => (
                                            <li
                                                key={sub.id}
                                                className="group flex justify-between items-center bg-white border border-gray-200 px-3 py-2 rounded text-sm hover:border-blue-300 transition">
                                                <span className="text-gray-700 font-medium">
                                                    {sub.name}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteSubCategory(sub.id)}
                                                    className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="삭제">
                                                    <FaTrash size={12} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg p-4">
                                        <span>등록된 하위 카테고리가 없습니다.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCategoryList;
