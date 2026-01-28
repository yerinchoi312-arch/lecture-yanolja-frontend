import type { SelectHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    registration?: UseFormRegisterReturn;
    error?: FieldError;
    options: Option[];
    label?: string;
}

function Select({ label, registration, error, options, className, ...props }: SelectProps) {
    return (
        <div>
            {label && (
                <label className={twMerge(["text-gray-800", "font-medium", "text-base","pb-2","block"])}>
                    {label}
                </label>
            )}
            <select
                className={twMerge(
                    ["w-full", "p-4", "rounded-xl"],
                    ["border", "border-gray-300", "text-sm"],
                    ["focus:outline-none", "focus:border-black"],
                    ["transition-all", "placeholder:text-gray-400"],
                    error ? ["focus:border-red-500","border-red-500"]  : "",
                    className,
                )}
                {...registration}
                {...props}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className={"mt-2 text-red-500 text-sm"}>{error.message}</p>}
        </div>
    );
}
export default Select;
