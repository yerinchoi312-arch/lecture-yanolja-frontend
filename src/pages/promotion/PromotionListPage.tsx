import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import type { CategoryData } from "../../type/category.ts";
import { getCategories } from "../../api/category.api.ts";
import BackButton from "../components/BackButton.tsx";

function PromotionListPage() {
    const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await getCategories();
                const data = response.data;
                setAllCategories(data);
            } catch (e) {
                console.log("데이터 로딩 실패:", e);
            }
        };
        fetchInfo().then(() => {});
    }, []);
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2"} />
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>기획전 전체</h2>
            </div>
            <div className={"space-x-4"}>
                <button
                    className={twMerge(
                        ["px-3", "py-1", "rounded-2xl"],
                        ["bg-gray-100", "font-medium"],
                    )}>
                    전체
                </button>
                {allCategories.map(category => (
                    <button
                        className={twMerge(
                            ["px-4", "py-2", "rounded-2xl"],
                            ["bg-gray-100", "font-medium"],
                        )}
                        type={"button"}
                        key={category.id}>
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default PromotionListPage;
