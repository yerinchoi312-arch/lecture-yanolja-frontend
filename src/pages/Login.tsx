import { twMerge } from "tailwind-merge";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import { useForm } from "react-hook-form";
import type { LoginFromType } from "../type/user.ts";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/auth.api.ts";
import { useAuthStore } from "../store/useAuthStore.ts";
import { AxiosError } from "axios";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFromType>();
    const onSubmit = async (data: LoginFromType) => {
        setError("root", { message: "" });
        try {
            const response = await loginUser(data);
            console.log(response);
            login(response.data.token, response.data.user);
            alert("로그인 되었습니다.");
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError("root", {
                    message: error.response?.data?.message || "로그인이 실패했습니다.",
                });
            } else {
                setError("root", { message: "오류가 발생했습니다." });
            }
        }
    };

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[600px]", "w-full", "mx-auto"],
            )}>
            <h3 className={"text-2xl font-bold text-gray-800 text-center"}>로그인</h3>
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
                    placeholder={"비밀번호를 입력해주세요."}
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
                {errors.root && (
                    <p className={"text-red-500 text-sm text-center"}>{errors.root.message}</p>
                )}
                <Button
                    fullWidth={true}
                    type={"submit"}
                    isLoading={isSubmitting}
                    className={"mt-5"}>
                    로그인
                </Button>
            </form>
            <p className={"text-center"}>
                회원이 아니신가요?
                <Link to={"/register"} className={"underline underline-offset-4 text-blue-500"}>
                    회원가입
                </Link>
            </p>
        </div>
    );
}
export default Login;
