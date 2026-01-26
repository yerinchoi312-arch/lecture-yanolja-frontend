import { twMerge } from "tailwind-merge";

function CategoryDetailPage() {
    return<div
        className={twMerge(
            ["flex", "flex-col", "gap-10", "py-10"],
            ["max-w-[1280px]", "mx-auto"],
        )}>
        <h2 className={twMerge(["text-xl","font-bold","mb-2"])}>호텔/리조트</h2>
    </div>
}
export default CategoryDetailPage