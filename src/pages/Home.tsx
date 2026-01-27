import { twMerge } from "tailwind-merge";
import CategoryTab from "../home/CategoryTab.tsx";
import EventSlide from "../components/EventSlide.tsx";
import Slide from "../components/Slide.tsx";
import Button from "../components/Button.tsx";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore.ts";
import Banner from "../home/Banner.tsx";
import Promotion from "../components/Promotion.tsx";
import { useEffect, useState } from "react";
import type { CategoryData } from "../type/category.ts";
import { getCategories } from "../api/category.api.ts";
function Home() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const [categories, setCategories] = useState<CategoryData[]>([]);
    useEffect(() => {
        getCategories().then(response => setCategories(response.data));
    }, []);
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto"],
            )}>
            {!isLoggedIn && (
                <div
                    className={twMerge(
                        ["flex", "justify-center", "items-center", "gap-4"],
                        ["bg-blue-50", "py-4", "rounded-2xl"],
                    )}>
                    <div>
                        <h3 className={"font-semibold text-lg text-gray-900"}>
                            가입하고 쿠폰 받으세요!
                        </h3>
                        <p className={"text-sm text-gray-800"}>신규회원 전용 혜택 지급</p>
                    </div>
                    <Button size={"sm"} onClick={() => navigate("/login")}>
                        로그인/가입하기 <FaAngleRight />
                    </Button>
                </div>
            )}
            <CategoryTab categories={categories} />
            <EventSlide id={"main"} />
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    이런 상품은 어떠세요?
                </h2>
                <Slide id={"subSlide"} />
            </div>
            <div>
                <Banner />
            </div>
            <div
                className={twMerge(
                    ["flex", "justify-center", "items-center", "text-center"],
                    ["bg-yellow-50", "py-4", "rounded-2xl"],
                )}>
                <div>
                    <h3 className={"font-semibold text-md text-gray-900"}>
                        놀수록 놀라운 이벤트 혜택
                    </h3>
                    <p className={"text-lg font-extrabold text-blue-800"}>NOL !&#10024; </p>
                </div>
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    지금 떠나는 도심 호캉스!
                </h2>
                <Slide id={"subSlide2"} />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>기획전 모음</h2>
                <Promotion />
            </div>
        </div>
    );
}
export default Home;
