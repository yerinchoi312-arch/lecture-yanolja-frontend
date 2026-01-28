import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { CategoryData } from "../../type/category.ts";
import { getCategories } from "../../api/category.api.ts";
import EventSlide from "../components/EventSlide.tsx";
import Promotion from "../components/Promotion.tsx";
import Slide from "../components/Slide.tsx";

function CategoryListPage() {
        const { path } = useParams(); // URL에서 "hotel" 등을 가져옴
        const [category, setCategory] = useState<CategoryData | null>(null);

        useEffect(() => {
            const fetchInfo = async () => {
                if (!path) return;
                try {
                    const response = await getCategories();
                    const data = response.data.find((item) => item.path === path);

                    if (data) {
                        setCategory(data);
                    }
                } catch (e) {
                    console.log("데이터 로딩 실패:", e);
                }
            };
            fetchInfo();
        }, [path]);

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-30", "py-10"],
                ["max-w-[1280px]", "mx-auto","w-full"],
            )}>
            <div className={"space-y-10 bg-gray-50 rounded-2xl p-10"}>
                <h2 className={twMerge(["text-3xl", "font-bold", "mb-10","text-center"])}>{category?.name}</h2>
                <div className={"w-full flex flex-wrap gap-3 justify-center"}>
                    {category?.subCategories?.map((subcategory) => (
                        <div key={subcategory.id} className={twMerge(["px-4","py-2","border","border-blue-100","rounded-2xl","bg-white"])}><p>{subcategory.name}</p></div>
                    ))}
                </div>

            </div>
            <EventSlide id={"subEvent"}/>
            <Slide id={"subSlide"}/>
            <Promotion/>
        </div>
    );
}
export default CategoryListPage;
