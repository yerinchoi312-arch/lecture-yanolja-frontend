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
            {label && (
                <label className={twMerge(["text-gray-800", "font-medium", "text-base","pb-2","block"])}>
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    ["w-full", "p-4","rounded-xl"],
                    ["border", "border-gray-300", "text-sm"],
                    ["focus:outline-none", "focus:border-black"],
                    ["transition-all", "placeholder:text-gray-400"],
                    className,)}
                {...props}
                {...registration}
            />
            {error && <p className={"mt-2 text-red-500 text-sm"}>{error.message}</p>}
        </div>
    );
}
export default Input;
