import { type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FiChevronDown } from "react-icons/fi";

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}
function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={twMerge(["w-full text-gray-800 text-base"], className)}>
            <div
                className={twMerge(["w-full"], ["flex", "justify-between", "items-center"],
                    ["hover:bg-blue-50"],
                    isOpen && ["font-medium","bg-blue-50"]
                )}
                onClick={() => setIsOpen(!isOpen)}>
                <p className={"p-4"}>{title}</p>
                <FiChevronDown
                    className={twMerge(["transition-all", "duration-300","mr-8"], isOpen && "rotate-180")}
                />
            </div>
            <div
                className={twMerge(
                    ["w-full", "overflow-hidden", "transition-all", "duration-300","text-sm"],
                    isOpen ? ["max-h-100","p-4","font-medium","text-gray-700"] : ["max-h-0"],
                )}>
                {children}
            </div>
        </div>
    );
}
export default Accordion;
