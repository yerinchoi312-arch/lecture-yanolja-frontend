import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaSave, FaExclamationCircle } from "react-icons/fa";
import { updateProduct } from "../../../api/admin.product.api";
import { uploadFile } from "../../../api/upload.api";
import type { Product } from "../../../type/product.ts";
import type { CategoryData } from "../../../type/category.ts";
import { getCategories } from "../../../api/category.api.ts";
import RoomEditItem from "./RoomEditItem.tsx";
import { fetchProductById } from "../../../api/product.api.ts";

interface ProductEditForm {
    categoryId: number;
    subCategoryId: number;
    name: string;
    address: string;
    description: string;
    notice: string;
    newImages: FileList; // 새로 업로드할 이미지들 (선택 사항)
}

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 상품 기본 정보 폼
    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm<ProductEditForm>();

    // 데이터 로드
    useEffect(() => {
        if (!id) return;

        const initData = async () => {
            try {
                const [productData, categoryData] = await Promise.all([
                    fetchProductById(Number(id)),
                    getCategories(),
                ]);

                setProduct(productData);
                setCategories(categoryData.data);

                // 폼 초기값 설정
                setValue("categoryId", productData.categoryId);
                setValue("subCategoryId", productData.subCategoryId);
                setValue("name", productData.name);
                setValue("address", productData.address);
                setValue("description", productData.description);
                setValue("notice", productData.notice);
            } catch (error) {
                console.error(error);
                alert("상품 정보를 불러오지 못했습니다.");
                navigate("/admin/products");
            } finally {
                setLoading(false);
            }
        };

        initData().then(() => {});
    }, [id, navigate, setValue]);

    // 카테고리 연동 로직
    const selectedCategoryId = watch("categoryId");
    useEffect(() => {
        if (!selectedCategoryId) {
            setSubCategories([]);
            return;
        }
        const category = categories.find(c => c.id === Number(selectedCategoryId));
        setSubCategories(category?.subCategories || []);
    }, [selectedCategoryId, categories]);

    // --- [상품 정보 수정 핸들러] ---
    const onProductSubmit = async (data: ProductEditForm) => {
        if (!product) return;
        if (!window.confirm("상품 기본 정보를 수정하시겠습니까?")) return;

        try {
            setIsSubmitting(true);
            let imageUrls = undefined; // undefined면 기존 이미지 유지 (백엔드 로직에 따름)

            // 새 이미지를 올렸다면, 기존 이미지를 모두 삭제하고 교체하는 로직
            if (data.newImages && data.newImages.length > 0) {
                if (
                    !window.confirm(
                        "새 이미지를 업로드하면 기존 이미지는 모두 삭제됩니다. 진행하시겠습니까?",
                    )
                ) {
                    setIsSubmitting(false);
                    return;
                }
                const files = Array.from(data.newImages);
                // 병렬 업로드
                imageUrls = await Promise.all(files.map(file => uploadFile(file, "products")));
            }

            await updateProduct(product.id, {
                categoryId: Number(data.categoryId),
                subCategoryId: Number(data.subCategoryId),
                name: data.name,
                address: data.address,
                description: data.description,
                notice: data.notice,
                images: imageUrls, // 있으면 교체, 없으면 undefined
            });

            alert("상품 기본 정보가 수정되었습니다.");
            // 최신 데이터 다시 불러오기 (이미지 등 갱신 확인)
            const updated = await fetchProductById(product.id);
            setProduct(updated);
        } catch (error) {
            console.error(error);
            alert("상품 수정 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 객실 삭제 후 UI 갱신 핸들러
    const handleRoomDeleteSuccess = (deletedRoomId: number) => {
        if (product) {
            setProduct({
                ...product,
                roomTypes: product.roomTypes.filter(r => r.id !== deletedRoomId),
            });
        }
    };

    if (loading) return <div className="p-10 text-center">데이터 로딩 중...</div>;
    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">상품 정보 수정</h1>
                <span className="text-sm text-gray-400">ID: #{product.id}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 왼쪽: 상품 기본 정보 (Product) */}
                <div className="lg:col-span-2 space-y-6">
                    <form
                        onSubmit={handleSubmit(onProductSubmit)}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            📦 기본 정보
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    카테고리
                                </label>
                                <select
                                    {...register("categoryId")}
                                    className="w-full border rounded px-3 py-2">
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    세부 카테고리
                                </label>
                                <select
                                    {...register("subCategoryId")}
                                    className="w-full border rounded px-3 py-2">
                                    {subCategories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    숙소 이름
                                </label>
                                <input
                                    {...register("name")}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    주소
                                </label>
                                <input
                                    {...register("address")}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    상세 설명
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={5}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    이용 안내
                                </label>
                                <textarea
                                    {...register("notice")}
                                    rows={3}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* 상품 이미지 변경 섹션 */}
                            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <label className="block text-sm font-bold text-blue-800 mb-2">
                                    이미지 관리
                                </label>

                                {/* 기존 이미지 목록 */}
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="w-20 h-20 shrink-0 rounded overflow-hidden border">
                                            <img
                                                src={img}
                                                alt="기존"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="text-xs text-gray-600 mb-2 flex items-start gap-1">
                                    <FaExclamationCircle className="mt-0.5 text-orange-500" />
                                    <span>
                                        새 이미지를 업로드하면{" "}
                                        <b>기존 이미지는 모두 삭제되고 교체</b>됩니다.
                                    </span>
                                </div>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    {...register("newImages")}
                                    className="w-full text-sm bg-white rounded border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-l file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 transition font-bold">
                                <FaSave /> 기본 정보 저장
                            </button>
                        </div>
                    </form>
                </div>

                {/* 오른쪽: 객실 관리 (RoomTypes) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                🛏️ 객실 관리
                            </h2>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {product.roomTypes.length}개
                            </span>
                        </div>

                        <div className="space-y-4 max-h-200 overflow-y-auto pr-1 custom-scrollbar">
                            {product.roomTypes.length > 0 ? (
                                product.roomTypes.map(room => (
                                    <RoomEditItem
                                        key={room.id}
                                        room={room}
                                        onDeleteSuccess={handleRoomDeleteSuccess}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-10">
                                    등록된 객실이 없습니다.
                                </p>
                            )}
                        </div>

                        {/* (추가 가능) 객실 추가 버튼은 여기 아래에 구현하거나 별도 모달로... 
                            지금은 '수정' 중심이므로 생략 */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductEdit;
