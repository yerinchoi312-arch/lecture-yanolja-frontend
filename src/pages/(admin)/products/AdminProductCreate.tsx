import { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaImage } from "react-icons/fa";
import { getCategories } from "../../../api/category.api";
import { createProduct } from "../../../api/admin.product.api";
import { uploadFile } from "../../../api/upload.api";
import { AxiosError } from "axios";
import type { CategoryData } from "../../../type/category.ts";

interface ProductFormValues {
    categoryId: string;
    subCategoryId: string;
    name: string;
    address: string;
    description: string;
    notice: string;
    images: FileList;
    roomTypes: {
        name: string;
        description: string;
        image: FileList;
        originPrice: number;
        price: number;
    }[];
}

const AdminProductCreate = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        defaultValues: {
            roomTypes: [
                { name: "", description: "", originPrice: 0, price: 0 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "roomTypes",
    });

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

    const selectedCategoryId = watch("categoryId");
    useEffect(() => {
        if (!selectedCategoryId) {
            setSubCategories([]);
            return;
        }
        const category = categories.find((c) => c.id === Number(selectedCategoryId));
        setSubCategories(category?.subCategories || []);
        setValue("subCategoryId", "");
    }, [selectedCategoryId, categories, setValue]);


    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        if (!data.images || data.images.length === 0) {
            alert("상품 대표 이미지를 최소 1장 등록해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);

            const productFiles = Array.from(data.images);

            const productImagePromises = productFiles.map((file) =>
                uploadFile(file, "products")
            );

            const productImgUrls = await Promise.all(productImagePromises);


            const roomTypesPromises = data.roomTypes.map(async (room, index) => {
                if (!room.image || room.image.length === 0) {
                    throw new Error(`${index + 1}번 객실('${room.name}')의 이미지를 등록해주세요.`);
                }

                const file = room.image[0];
                const roomImgUrl = await uploadFile(file, "rooms");

                return {
                    name: room.name,
                    description: room.description,
                    image: roomImgUrl,
                    originPrice: Number(room.originPrice),
                    price: Number(room.price),
                };
            });

            const processedRoomTypes = await Promise.all(roomTypesPromises);


            const payload = {
                categoryId: Number(data.categoryId),
                subCategoryId: Number(data.subCategoryId),
                name: data.name,
                address: data.address,
                description: data.description,
                notice: data.notice,
                images: productImgUrls,
                roomTypes: processedRoomTypes,
            };

            await createProduct(payload);

            alert("상품이 성공적으로 등록되었습니다.");
            navigate("/admin/products");

        } catch (error) {
            console.error(error);
            let message = "상품 등록 중 오류가 발생했습니다."
            if (error instanceof AxiosError) message = error.response?.data.message;
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">새 상품 등록</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4">기본 정보</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                            <select
                                {...register("categoryId", { required: "카테고리를 선택해주세요" })}
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">선택하세요</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">세부 카테고리</label>
                            <select
                                {...register("subCategoryId", { required: "세부 카테고리를 선택해주세요" })}
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={subCategories.length === 0}
                            >
                                <option value="">선택하세요</option>
                                {subCategories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.subCategoryId && <p className="text-red-500 text-xs mt-1">{errors.subCategoryId.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">숙소 이름</label>
                            <input
                                {...register("name", { required: "숙소 이름을 입력해주세요" })}
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 시그니엘 서울"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                            <input
                                {...register("address", { required: "주소를 입력해주세요" })}
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 서울특별시 송파구 올림픽로 300"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명</label>
                            <textarea
                                {...register("description", { required: "상세 설명을 입력해주세요" })}
                                rows={5}
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="숙소에 대한 자세한 설명을 입력하세요."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">이용 안내 / 공지사항</label>
                            <textarea
                                {...register("notice", { required: "이용 안내를 입력해주세요" })}
                                rows={4}
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="체크인/체크아웃 시간, 주차 안내 등"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">숙소 대표 이미지 (여러 장 가능)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    {...register("images", { required: "이미지를 업로드해주세요" })}
                                    className="hidden"
                                    id="product-images"
                                />
                                <label htmlFor="product-images" className="cursor-pointer flex flex-col items-center gap-2">
                                    <FaImage className="text-gray-400 text-3xl" />
                                    <span className="text-blue-600 font-medium">클릭하여 이미지 업로드</span>
                                    <span className="text-gray-400 text-xs">JPG, PNG, WEBP (최대 10MB)</span>
                                </label>
                            </div>
                            {watch("images") && watch("images").length > 0 && (
                                <p className="text-sm text-green-600 mt-2">
                                    {watch("images").length}개의 파일이 선택됨
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-lg font-bold">객실 정보 관리</h2>
                        <button
                            type="button"
                            onClick={() => append({ name: "", description: "", image: undefined as any, originPrice: 0, price: 0 })}
                            className="text-sm flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition"
                        >
                            <FaPlus /> 객실 추가
                        </button>
                    </div>

                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                )}

                                <h3 className="font-semibold text-gray-700 mb-3">객실 #{index + 1}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">객실명</label>
                                        <input
                                            {...register(`roomTypes.${index}.name` as const, { required: true })}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                            placeholder="예: 디럭스 더블"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">객실 이미지 (1장)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register(`roomTypes.${index}.image` as const, { required: true })}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">객실 설명</label>
                                        <input
                                            {...register(`roomTypes.${index}.description` as const, { required: true })}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                            placeholder="객실 특징 간략 설명"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">정상가 (원)</label>
                                        <input
                                            type="number"
                                            {...register(`roomTypes.${index}.originPrice` as const, { required: true, min: 0 })}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">판매가 (원)</label>
                                        <input
                                            type="number"
                                            {...register(`roomTypes.${index}.price` as const, { required: true, min: 0 })}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:bg-gray-400 font-bold"
                    >
                        <FaSave /> {isSubmitting ? "저장 중..." : "상품 등록 완료"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductCreate;