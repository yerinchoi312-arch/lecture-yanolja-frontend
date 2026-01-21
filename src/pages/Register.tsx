import { twMerge } from "tailwind-merge";

function Register() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[800px]", "w-full", "mx-auto"],
            )}>
            회원가입
        </div>
    );
}
export default Register;
