import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    fullWidth?: boolean;
    label?: string;
    registration?: UseFormRegisterReturn;
    error?: FieldError;
}

function Input({ label, fullWidth = true, registration, error,className,...props }: InputProps) {
    return (
        <div className={twMerge([fullWidth && "w-full"])}>
            <div className={"flex items-center gap-4 pb-2"}>
                {label && (
                    <label className={twMerge(["text-gray-800", "font-medium", "text-base","block"])}>
                        {label}
                    </label>
                )}
                {error && <p className={"text-red-500 text-sm"}>{error.message}</p>}
            </div>
            <input
                className={twMerge(
                    ["w-full", "p-4","rounded-xl"],
                    ["border", "border-gray-300", "text-sm"],
                    ["focus:outline-none", "focus:border-black"],
                    ["transition-all", "placeholder:text-gray-400"],
                    error ? ["focus:border-red-500","border-red-500"] : "",
                    className,)}
                {...props}
                {...registration}
            />
        </div>
    );
}
export default Input;
