import { twMerge } from "tailwind-merge";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pageNumbers: number[] = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages){
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++){
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    return (
        <div className={twMerge(["flex", "justify-center", "items-center", "gap-2", "mt-8"])}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={twMerge(
                    ["p-2", "rounded-xl"],
                    ["hover:cursor-pointer",
                        "disabled:opacity-30",
                        "disabled:cursor-not-allowed",
                    ],
                )}>
                <MdChevronLeft />
            </button>
            {getPageNumbers().map(page => (
                <button
                    onClick={()=>onPageChange(page)}
                    className={twMerge(
                        ["w-9", "h-9", "flex", "justify-center", "items-center"],
                        ["rounded-xl", "text-sm", "font-medium"],
                        currentPage === page
                            ? ["bg-blue-400","text-white","font-bold"]
                            :["border","border-blue-400","bg-white","text-blue-600"]
                    )}>
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={totalPages === currentPage}
                className={twMerge(
                    ["p-2", "rounded-xl"],
                    ["hover:cursor-pointer",
                        "disabled:opacity-30",
                        "disabled:cursor-not-allowed",
                    ],
                )}>
                <MdChevronRight />
            </button>
        </div>
    );
}
export default Pagination;
