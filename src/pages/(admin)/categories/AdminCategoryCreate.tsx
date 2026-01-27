import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCategory } from "../../../api/admin.category.api";
import { FaArrowLeft, FaSave } from "react-icons/fa";

interface FormInputs {
    name: string;
    path: string;
    image: FileList;
}

const AdminCategoryCreate = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        try {
            if (!data.image || data.image.length === 0) {
                alert("대표 이미지를 선택해주세요.");
                return;
            }

            await createCategory({
                name: data.name,
                path: data.path,
                image: data.image[0],
            });

            alert("카테고리가 생성되었습니다.");
            navigate("/admin/categories"); // 목록으로 복귀
        } catch (error) {
            console.error(error);
            alert("생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6">
                <FaArrowLeft /> 뒤로가기
            </button>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold mb-6">1차 카테고리 생성</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            카테고리 이름
                        </label>
                        <input
                            {...register("name", { required: "이름은 필수입니다." })}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="예: 호텔, 레저/티켓"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL 경로 (Path)
                        </label>
                        <input
                            {...register("path", { required: "경로는 필수입니다." })}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="예: hotel (영어 소문자 권장)"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            URL에 사용될 고유한 영문 이름입니다. (중복 불가)
                        </p>
                        {errors.path && (
                            <p className="text-red-500 text-xs mt-1">{errors.path.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            대표 이미지
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", { required: "이미지는 필수입니다." })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
                        )}
                    </div>

                    <div className="pt-4 border-t mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 transition disabled:bg-gray-400">
                            <FaSave /> {isSubmitting ? "생성 중..." : "저장하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategoryCreate;
