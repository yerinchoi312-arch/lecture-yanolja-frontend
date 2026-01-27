import { twMerge } from "tailwind-merge";
import CategoryTab from "../home/CategoryTab.tsx";
import EventSlide from "../home/EventSlide.tsx";
import Slide from "../components/Slide.tsx";
import Button from "../components/Button.tsx";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore.ts";
import Banner from "../home/Banner.tsx";
function Home() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
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
            <CategoryTab />
            <EventSlide id={"main"} />
            <div>
                <h2 className={twMerge(["text-xl", "font-bold", "mb-2"])}>이런 상품은 어떠세요?</h2>
                <Slide id={"subSlide"} />
            </div>
            <div>
                <Banner />
            </div>
            <div>
                <h2 className={twMerge(["text-xl", "font-bold", "mb-2"])}>이런 상품은 어떠세요?</h2>
                <Slide id={"subSlide2"} />
            </div>
            <div>기획전 모음</div>
        </div>
    );
}
export default Home;
