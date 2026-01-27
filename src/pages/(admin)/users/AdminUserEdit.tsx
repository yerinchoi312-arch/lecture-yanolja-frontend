import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaSave, FaUserCog, FaLock, FaInfoCircle } from "react-icons/fa";
import { fetchUserById, updateUserByAdmin } from "../../../api/admin.user.api";
import type { AdminUpdateUserParams } from "../../../type/admin.user";

const AdminUserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // 폼 설정
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AdminUpdateUserParams>();

    // 데이터 로드
    useEffect(() => {
        if (!id) return;

        const loadUser = async () => {
            try {
                setLoading(true);
                const userData = await fetchUserById(Number(id));

                setValue("email", userData.email);
                setValue("name", userData.name);
                setValue("phone", userData.phone);
                setValue("birthdate", userData.birthdate);
                setValue("gender", userData.gender);
                setValue("role", userData.role);
            } catch (error) {
                console.error(error);
                alert("회원 정보를 불러올 수 없습니다.");
                navigate("/admin/users");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id, navigate, setValue]);

    // 수정 제출 핸들러
    const onSubmit = async (data: AdminUpdateUserParams) => {
        if (!id) return;

        const payload: AdminUpdateUserParams = { ...data };
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        try {
            await updateUserByAdmin(Number(id), payload);
            alert("회원 정보가 성공적으로 수정되었습니다.");
            navigate("/admin/users");
        } catch (error) {
            console.error(error);
            alert("수정 실패: 입력 값을 확인해주세요.");
        }
    };

    if (loading)
        return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            {/* 상단 네비게이션 */}
            <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
                <FaArrowLeft /> 회원 목록으로 돌아가기
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* 헤더 */}
                <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <FaUserCog /> 회원 정보 관리
                        </h1>
                        <p className="text-slate-300 text-sm mt-1">
                            User ID: <span className="font-mono text-yellow-400">#{id}</span>의
                            정보를 수정합니다.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    {/* 섹션 1: 계정 및 권한 설정 */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                            <FaLock className="text-blue-500" size={16} /> 계정 및 권한
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    이메일
                                </label>
                                <input
                                    {...register("email", { required: "이메일은 필수입니다." })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    계정 권한
                                </label>
                                <select
                                    {...register("role")}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="USER">일반 회원 (USER)</option>
                                    <option value="ADMIN">관리자 (ADMIN)</option>
                                </select>
                                <div className="mt-2 flex items-start gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                    <FaInfoCircle className="mt-0.5 shrink-0" />
                                    <span>
                                        관리자(ADMIN) 권한 부여 시 관리자 페이지 접근이
                                        가능해집니다. 신중하게 변경해주세요.
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    비밀번호 초기화 (선택사항)
                                </label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        minLength: { value: 8, message: "8자 이상 입력하세요." },
                                    })}
                                    placeholder="변경하려면 새 비밀번호를 입력하세요 (비워두면 유지됨)"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * 사용자가 비밀번호를 분실했을 경우, 관리자가 여기서 새
                                    비밀번호를 설정해 줄 수 있습니다.
                                </p>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                            <FaUserCog className="text-blue-500" size={16} /> 개인 정보
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    이름
                                </label>
                                <input
                                    {...register("name")}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    전화번호
                                </label>
                                <input
                                    {...register("phone")}
                                    placeholder="010-0000-0000"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    생년월일
                                </label>
                                <input
                                    type="date"
                                    {...register("birthdate")}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    성별
                                </label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="MALE"
                                            {...register("gender")}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>남성</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="FEMALE"
                                            {...register("gender")}
                                            className="text-pink-600 focus:ring-pink-500"
                                        />
                                        <span>여성</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:bg-gray-400 font-bold">
                            <FaSave /> {isSubmitting ? "저장 중..." : "변경사항 저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUserEdit;
