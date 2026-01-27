import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import type { CategoryData } from "../type/category.ts";
interface CategoryTabProps {
    categories : CategoryData[]
}
function CategoryTab({categories}: CategoryTabProps){

    return (
        <div
            className={twMerge(
                ["flex", "justify-center", "items-center", "gap-4"],
                ["w-[1280px]", "mx-auto"],
            )}>
            {categories.map(category => (
                <Link
                    key={category.id}
                    to={`/categories/${category.path}`}
                    className={twMerge(
                        ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                        ["flex-1", "w-full", "font-semibold", "text-lg"],
                        [ "py-4", "rounded-2xl"],
                        ["first:bg-violet-50","nth-[2]:bg-green-50","nth-[3]:bg-yellow-50"],
                        ["hover:-translate-y-3", "transition-all", "duration-500"],
                    )}>
                    <img src={category.image} alt={category.name} className={"w-24 h-24 -mb-2"} />
                    <h3>{category.name}</h3>
                </Link>
            ))}
        </div>
    );
}
export default CategoryTab;
