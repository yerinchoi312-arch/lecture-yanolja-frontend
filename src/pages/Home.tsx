import category1 from "../assets/images/icon/category_hotel.png";
import category2 from "../assets/images/icon/category_pension.png";
import category3 from "../assets/images/icon/category_motel.png";
import { Link, useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import { IoReorderFourOutline } from "react-icons/io5";
function Home() {
    const {id} = useParams();
    return (
        <div className={twMerge(["flex","flex-col","gap-10","py-10"],["max-w-[1200px]", "mx-auto",])}>
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
            </div>
            <div>이벤트 슬라이더</div>
            <div>숙소랭킹 슬라이드</div>
            <div>리조트 특가 배너</div>
            <div>호캉스 슬라이드</div>
            <div>기획전 모음</div>
        </div>
    );
}
export default Home;
