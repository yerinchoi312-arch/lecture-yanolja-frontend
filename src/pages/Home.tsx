import { twMerge } from "tailwind-merge";
import CategoryTab from "../home/CategoryTab.tsx";
import EventSlide from "../home/EventSlide.tsx";
import Slide from "../components/Slide.tsx";
function Home() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[1200px]", "mx-auto"],
            )}>
            <CategoryTab />
            <EventSlide id={"main"}/>
            <div >
                <h2 className={twMerge(["text-xl","font-bold","mb-2"])}>
                    이런 상품은 어떠세요?
                </h2>
                <Slide id={"subSlide"}/>
            </div>
            <div>리조트 특가 배너</div>
            <div>호캉스 슬라이드</div>
            <div>기획전 모음</div>
        </div>
    );
}
export default Home;
