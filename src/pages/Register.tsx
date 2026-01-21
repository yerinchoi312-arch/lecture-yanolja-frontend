import { twMerge } from "tailwind-merge";
import Input from "../components/Input.tsx";
import { useForm } from "react-hook-form";
import type { RegisterFromType } from "../type/user.ts";

function Register() {
    const {register,handleSubmit}=useForm<RegisterFromType>();
    const onSubmit = () => {

    }
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[600px]", "w-full", "mx-auto"],
            )}>
            <h3 className={"text-2xl font-bold text-gray-800"}>회원가입</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input label={"아이디"} placeholder={"아이디를 입력해주세요."} registration={register("username")}/>
            </form>
        </div>
    );
}
export default Register;
