import { twMerge } from "tailwind-merge";
import CategoryTab from "./(home)/CategoryTab.tsx";
import EventSlide from "./(home)/EventSlide.tsx";
import Slide from "./components/Slide.tsx";
import Button from "./components/Button.tsx";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore.ts";
import Banner from "./(home)/Banner.tsx";
import { useEffect, useState } from "react";
import type { CategoryData } from "../type/category.ts";
import { getCategories } from "../api/category.api.ts";
import TopButton from "./components/TopButton.tsx";
function Home() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        getCategories().then(response => setCategories(response.data));
    }, []);

    const SEOUL_ARRAY = categories.flatMap(category =>
        category.subCategories.filter(sub => sub.name === "서울").map(sub => sub.id),
    );
    const BUSAN_ARRAY = categories.flatMap(category =>
        category.subCategories.filter(sub => sub.name === "부산").map(sub => sub.id),
    );
    const JEJU_ARRAY = categories.flatMap(category =>
        category.subCategories.filter(sub => sub.name === "제주").map(sub => sub.id),
    );
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
            <EventSlide slideId={"main"} />
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
                    이런 상품은 어떠세요?
                </h2>
                <Slide slidesPerView={5} slidesPerGroup={5} categoryId={0} slideId={"subSlide"} />
            </div>
            <div>
                <Banner slideId={"bannerSlide"} />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    지금 떠나는 도심 여행!
                </h2>
                <Slide
                    slidesPerView={4}
                    slidesPerGroup={4}
                    categoryId={0}
                    subCategoryId={SEOUL_ARRAY}
                    slideId={"seoul_slide"}
                />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    지금 떠나는 부산 여행!
                </h2>
                <Slide slidesPerView={4} slidesPerGroup={4} slideId={"busan_slide"} categoryId={0} subCategoryId={BUSAN_ARRAY} />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    지금 떠나는 제주도 여행!
                </h2>
                <Slide
                    slidesPerView={4}
                    slidesPerGroup={4}
                    categoryId={0}
                    subCategoryId={JEJU_ARRAY}
                    slideId={"jeju_slide"}
                />
            </div>
            <TopButton />
        </div>
    );
}
export default Home;
