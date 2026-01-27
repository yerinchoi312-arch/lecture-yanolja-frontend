import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { createSubCategory } from "../../../api/admin.category.api";
import { FaArrowLeft, FaSave } from "react-icons/fa";

interface FormInputs {
    name: string;
}

const AdminSubCategoryCreate = () => {
    const navigate = useNavigate();
    const { parentId } = useParams();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        if (!parentId) {
            alert("잘못된 접근입니다.");
            navigate("/admin/categories");
            return;
        }

        try {
            await createSubCategory({
                categoryId: Number(parentId),
                name: data.name,
            });

            alert("하위 카테고리가 추가되었습니다.");
            navigate("/admin/categories");
        } catch (error) {
            console.error(error);
            alert("생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6">
                <FaArrowLeft /> 뒤로가기
            </button>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="mb-6 pb-4 border-b">
                    <span className="text-sm text-blue-600 font-semibold">
                        Parent ID: {parentId}
                    </span>
                    <h1 className="text-2xl font-bold mt-1">하위 카테고리 생성</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            카테고리 이름
                        </label>
                        <input
                            {...register("name", { required: "이름은 필수입니다." })}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="예: 디럭스, 스탠다드, 티켓/패스"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
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

export default AdminSubCategoryCreate;
