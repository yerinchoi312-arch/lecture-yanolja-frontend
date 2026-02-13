import { twMerge } from "tailwind-merge";
import Input from "../components/Input.tsx";
import Select from "../components/Select.tsx";
import Button from "../components/Button.tsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import type { UserResponse } from "../../type/user.ts";
import type { AxiosError } from "axios";
import { updatePassword, updateUserInfo } from "../../api/user.api.ts";

interface AccountEditForm extends UserResponse{
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}

function AccountEdit() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AccountEditForm>({
        defaultValues: {
            username:user?.username || "",
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            birthdate: user?.birthdate || "",
            gender: user?.gender || "MALE",
        },
    });

    const newPassword = watch("newPassword")

    if(!user) return null;
    const onSubmit = async (data:AccountEditForm) => {

        try{
            const updatedData={
                name:data.name,
                phone:data.phone,
                birthdate:data.birthdate,
            };

            const response = await updateUserInfo(updatedData);

            if( newPassword && newPassword.length > 0) {
                await updatePassword({
                    currentPassword:data.currentPassword || "",
                    newPassword:data.newPassword || "",
                    newPasswordConfirm:data.newPasswordConfirm || "",
                })
            }
            if (response && response.data) {
                updateUser({ ...user, ...response.data });
            }
            alert("프로필이 수정되었습니다.")
            navigate("/");
        }catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const msg = axiosError.response?.data?.message || "프로필 수정 실패";
            alert(msg)
            console.error("상세 에러:", axiosError.response?.data);
        }
    };
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[600px]", "w-full", "mx-auto"],
            )}>
            <h3 className={"text-2xl font-bold text-gray-800 text-center"}>계정 관리</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-3"}>
                <Input
                    label={"아이디"}
                    readOnly
                    placeholder={"아이디를 입력해주세요."}
                    registration={register("username", {
                        required: "아이디는 필수값입니다.",
                        minLength: {
                            value: 2,
                            message: "2글자 이상 입력해주세요.",
                        },
                    })}
                    error={errors.username}
                />
                <Input
                    label={"현재 비밀번호"}
                    placeholder={"현재 비밀번호를 입력해주세요."}
                    type={"password"}
                    registration={register("currentPassword", {
                        required: newPassword ? "현재 비밀번호를 입력해야 변경 가능합니다." : false,
                    })}
                    error={errors.currentPassword}
                />
                <Input
                    label={"새 비밀번호"}
                    placeholder={"8자 이상 (변경시에만 입력하세요.)"}
                    type={"password"}
                    registration={register("newPassword", {
                        minLength:{
                            value:8,
                            message:"비밀번호는 최소 8자 이상입니다."
                        }
                    })}
                    error={errors.newPassword}
                />
                <Input
                    label={"비밀번호 확인"}
                    placeholder={"비밀번호를 다시 입력해주세요."}
                    type={"password"}
                    registration={register("newPasswordConfirm", {
                        validate: value =>
                           !newPassword || value === newPassword || "새 비밀번호가 일치하지 않습니다.",
                    })}
                    error={errors.newPasswordConfirm}
                />
                <Input
                    label={"이메일"}
                    readOnly
                    placeholder={"이메일을 입력해주세요."}
                    registration={register("email", {
                        required: "이메일은 필수값입니다.",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "올바른 이메일 형식이 아닙니다.",
                        },
                    })}
                    error={errors.email}
                />
                <Input
                    label={"이름"}
                    placeholder={"이름을 입력해주세요."}
                    registration={register("name", {
                        required: "이름은 필수값입니다.",
                    })}
                    error={errors.name}
                />
                <Input
                    label={"전화번호"}
                    placeholder={"휴대폰 번호 (XXX-XXXX-XXXX)"}
                    registration={register("phone", {
                        required: "전화번호는 필수값입니다.",
                        pattern: {
                            value: /^\d{3}-\d{3,4}-\d{4}$/,
                            message: "올바른 휴대폰 번호 형식이 아닙니다.(-포함)",
                        },
                    })}
                    error={errors.phone}
                />
                <div className={"flex items-center gap-2"}>
                    <div className={"w-2/3"}>
                        <Input
                            label={"생년월일"}
                            placeholder={"생년월일 (YYYY-MM-DD)"}
                            registration={register("birthdate", {
                                required: "생년월일은 필수값입니다.",
                                pattern: {
                                    value: /^\d{4}-\d{2}-\d{2}$/,
                                    message: "올바른 생년월일 형식이 아닙니다.",
                                },
                            })}
                            error={errors.birthdate}
                        />
                    </div>
                    <div className={"w-1/3"}>
                        <Select
                            label={"성별"}
                            registration={register("gender")}
                            options={[
                                { value: "MALE", label: "MALE" },
                                { value: "FEMALE", label: "FEMALE" },
                            ]}
                            error={errors.gender}
                        />
                    </div>
                </div>
                {errors.root && (
                    <p className={"text-red-500 text-sm text-center"}>{errors.root.message}</p>
                )}
                <Button
                    fullWidth={true}
                    type={"submit"}
                    isLoading={isSubmitting}
                    className={"mt-5"}>
                    정보수정
                </Button>
            </form>
        </div>
    );
}
export default AccountEdit;
