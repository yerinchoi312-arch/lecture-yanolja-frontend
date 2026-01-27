import { twMerge } from "tailwind-merge";
import Input from "../components/Input.tsx";
import { useForm } from "react-hook-form";
import type { RegisterFromType } from "../type/user.ts";
import Select from "../components/Select.tsx";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router";
import { registerUser } from "../api/auth.api.ts";
import { AxiosError } from "axios";

function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFromType>();


    const onSubmit =async (data:RegisterFromType) => {
        setError("root",{message:""})
        try{
            await registerUser(data);
            alert("회원가입이 완료되었습니다. 로그인을 해주세요.");
            navigate("/login")
        }catch (error) {
            if (error instanceof AxiosError){
                setError("root", {message:error.response?.data?.message})
            }else{
                setError("root",{message:"오류가 발생했습니다."})
            }
        }
    };
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[600px]", "w-full", "mx-auto"],
            )}>
            <h3 className={"text-2xl font-bold text-gray-800 text-center"}>회원가입</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-3"}>
                <Input
                    label={"아이디"}
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
                    label={"비밀번호"}
                    placeholder={"비밀번호를 입력해주세요. (8자 이상)"}
                    type={"password"}
                    registration={register("password", {
                        required: "비밀번호는 필수값입니다.",
                        minLength: {
                            value: 8,
                            message: "비밀번호는 최소 8자입니다.",
                        },
                    })}
                    error={errors.password}
                />
                <Input
                    label={"비밀번호 확인"}
                    placeholder={"비밀번호를 다시 입력해주세요."}
                    type={"password"}
                    registration={register("password_confirm", {
                        required: "비밀번호 확인을 입력해주세요.",
                        validate: value =>
                            value === watch("password") || "비밀번호가 일치하지 않습니다.",
                    })}
                    error={errors.password_confirm}
                />
                <Input
                    label={"이메일"}
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
                    회원가입
                </Button>
            </form>
        </div>
    );
}
export default Register;
