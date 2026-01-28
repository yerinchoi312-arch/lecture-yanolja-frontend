import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { CategoryData } from "../../type/category.ts";
import { getCategories } from "../../api/category.api.ts";
import EventSlide from "../components/EventSlide.tsx";
import Promotion from "../components/PromotionBox.tsx";
import Slide from "../components/Slide.tsx";

function CategoryListPage() {
    const { path } = useParams();
    const [category, setCategory] = useState<CategoryData | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            if (!path) return;
            try {
                const response = await getCategories();
                const data = response.data.find(item => item.path === path);

                if (data) {
                    setCategory(data);
                }
            } catch (e) {
                console.log("데이터 로딩 실패:", e);
            }
        };
        fetchInfo().then(()=>{});
    }, [path]);

    return (
        <div
            className={twMerge(
                ["space-y-30", "py-10"],
                ["max-w-[1280px]", "mx-auto"],
            )}>
            <div>
                <h2 className={twMerge(["text-3xl", "font-bold", "mb-10", "text-center"])}>
                    {category?.name}
                </h2>
                <div
                    className={twMerge(
                        ["flex", "flex-col", "justify-center", "items-center", "gap-10", "p-10"],
                        ["border-2", "border-gray-200"],
                        ["rounded-2xl"],
                    )}>
                    <p className={"text-center font-semibold text-xl"}>어디로 갈까요?</p>
                    <div className={"w-full flex flex-wrap gap-3 justify-center"}>
                        {category?.subCategories?.map(subcategory => (
                            <button
                                type={"button"}
                                key={subcategory.id}
                                className={twMerge(
                                    ["px-4", "py-2", "rounded-2xl"],
                                    ["text-gray-700", "bg-gray-50","font-medium"],
                                )}>
                                {subcategory.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div></div>
            </div>
            <EventSlide id={"subEvent"} />
            <Slide id={"subSlide"} />
            <Promotion />
        </div>
    );
}
export default CategoryListPage;
