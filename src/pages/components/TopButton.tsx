import { twMerge } from "tailwind-merge";
import { IoIosArrowUp } from "react-icons/io";
import { useEffect, useState } from "react";

function TopButton() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {isScrolled && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={twMerge(
                        ["fixed", "right-10", "bottom-10", "z-10"],
                        ["p-4", "bg-gray-50", "shadow", "rounded-2xl"],
                    )}>
                    <IoIosArrowUp size={20} />
                </button>
            )}
        </>
    );
}
export default TopButton;
