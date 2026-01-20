import category1 from "../assets/images/icon/category_hotel.png";
import category2 from "../assets/images/icon/category_pension.png";
import category3 from "../assets/images/icon/category_motel.png";
import { IoReorderFourOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { Link, useParams } from "react-router";
function CategoryTab() {
    const {id} = useParams();
    return(
        <div
            className={twMerge(
                ["flex", "justify-center", "items-center"],
                ["w-[1080px]", "mx-auto"],
            )}>
            <button
                className={twMerge(
                    ["cursor-pointer", "p-2", "hover:border-gray-500"],
                    ["border", "border-gray-100", "rounded-xl"],
                    ["transition-all", "duration-100"],
                )}>
                <IoReorderFourOutline className={"w-10 h-10"} />
            </button>
            <Link
                to={`/category/${id}`}
                className={twMerge(
                    ["flex", "justify-center", "items-end"],
                    ["flex-1", "w-full"],
                    ["font-bold", "hover:underline", "hover:underline-offset-4"],
                )}>
                <img src={category1} alt={"hotel"} className={"w-24 h-24 -mb-2"} />
                호텔/리조트
            </Link>
            <Link
                to={`/category/${id}`}
                className={twMerge(
                    ["flex", "justify-center", "items-end"],
                    ["flex-1", "w-full"],
                    ["font-bold", "hover:underline", "hover:underline-offset-4"],
                )}>
                <img src={category2} alt={"pension"} className={"w-24 h-24 -mb-2"} />
                펜션/풀빌라
            </Link>
            <Link
                to={`/category/${id}`}
                className={twMerge(
                    ["flex", "justify-center", "items-end"],
                    ["flex-1", "w-full"],
                    ["font-bold", "hover:underline", "hover:underline-offset-4"],
                )}>
                <img src={category3} alt={"motel"} className={"w-24 h-24 -mb-2"} />
                모텔
            </Link>
        </div>)
}
export default CategoryTab