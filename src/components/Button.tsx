import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "error";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    isLoading?: boolean;}

    function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth,
    isLoading,
    className,
        onClick,
    ...props
}: ButtonProps) {
    const baseStyle = twMerge(
        ["flex", "items-center", "justify-center"],
        ["font-bold", "border", "rounded-xl"],
        ["transition-color", "focus:outline-none"],
        ["disabled:opacity-50", "disabled:cursor-not-allowed"],
    );

    const variants = {
        primary: twMerge(["bg-blue-500", "hover:bg-blue-700", "text-white", "border-transparent"]),
        secondary: twMerge(["bg-white", "hover:bg-gray-100", "text-gray-700", "border-gray-200"]),
        error: twMerge(["bg-red-500", "hover:bg-red-700", "text-white", "border-transparent"]),
    };

    const sizes = {
        sm: twMerge(["h-10", "px-4", "text-sm"]),
        md: twMerge(["h-12", "px-6", "text-base"]),
        lg: twMerge(["h-14", "px-6", "text-lg"]),
    };

    return (
        <button
            onClick={onClick}
            className={twMerge(
                baseStyle,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className,
            )}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
export default Button;
