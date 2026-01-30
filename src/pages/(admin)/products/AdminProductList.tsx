import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { fetchProducts } from "../../../api/product.api";
import { deleteProduct } from "../../../api/admin.product.api";
import { getCategories } from "../../../api/category.api.ts";
import type { ProductListParams, ProductSummary } from "../../../type/product.ts";
import type { CategoryData } from "../../../type/category.ts";

const AdminProductList = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0 });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await getCategories();
                setCategories(result.data);
            } catch (error) {
                console.error("카테고리 로드 실패", error);
            }
        };
        loadCategories().then(() => {});
    }, []);

    // 2. 상품 목록 로드
    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: ProductListParams = {
                page,
                limit: 10,
                keyword: keyword || undefined,
                categoryId: selectedCategory === "" ? undefined : Number(selectedCategory),
            };

            const response = await fetchProducts(params);

            setProducts(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error(error);
            alert("상품 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts().then(() => {});
    }, [page, selectedCategory]);

    // --- [Handlers] ---

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadProducts().then(() => {});
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 이 상품을 삭제하시겠습니까? 복구할 수 없습니다.")) return;
        try {
            await deleteProduct(id);
            alert("상품이 삭제되었습니다.");
            loadProducts().then(() => {});
        } catch (error) {
            console.error(error);
            alert("삭제 실패");
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/products/${id}`);
    };

    const handleCreate = () => {
        navigate("/admin/products/new");
    };

    if (loading && page === 1 && products.length === 0) {
        return <div className="p-10 text-center">로딩 중...</div>;
    }

    return (
        <div className="space-y-6">
            {/* 1. 헤더 (타이틀 + 등록 버튼) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">상품 관리</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        등록된 숙소 상품을 조회하고 관리합니다. (총 {pagination.totalItems}개)
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
                    <FaPlus size={14} /> 상품 등록
                </button>
            </div>

            {/* 2. 필터 및 검색 바 */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* 카테고리 필터 */}
                <div className="w-full md:w-48">
                    <select
                        value={selectedCategory}
                        onChange={e => {
                            setSelectedCategory(Number(e.target.value));
                            setPage(1);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">전체 카테고리</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 검색창 */}
                <form onSubmit={handleSearch} className="w-full md:flex-1 relative">
                    <input
                        type="text"
                        placeholder="숙소 이름 또는 주소 검색..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <button
                        type="submit"
                        className="absolute right-1 top-1 bottom-1 bg-gray-100 text-gray-600 px-4 rounded-md text-sm hover:bg-gray-200 transition">
                        검색
                    </button>
                </form>
            </div>

            {/* 3. 상품 목록 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b">
                            <tr>
                                <th className="px-6 py-4 w-20">ID</th>
                                <th className="px-6 py-4 w-32">이미지</th>
                                <th className="px-6 py-4">숙소 정보</th>
                                <th className="px-6 py-4">최저가</th>
                                <th className="px-6 py-4">평점/리뷰</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">#{product.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                                {product.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-800 text-base">
                                                    {product.name}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <FaMapMarkerAlt className="text-gray-400" />
                                                    {product.address}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {product.minPrice.toLocaleString()}원~
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-400" />
                                                <span className="font-bold text-gray-800">
                                                    {product.ratingAvg}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    ({product.reviewCount})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(product.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
                                                <FaEdit size={12} /> 수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-100 rounded text-red-500 hover:bg-red-50 transition">
                                                <FaTrash size={12} /> 삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-400">
                                        등록된 상품이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. 페이지네이션 */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 py-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">
                        이전
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-2 border rounded ${
                                page === p
                                    ? "bg-slate-800 text-white border-slate-800"
                                    : "bg-white hover:bg-gray-50"
                            }`}>
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminProductList;
