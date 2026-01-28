import promotion1 from "../../assets/images/slide/promotion1.png";
import promotion2 from "../../assets/images/slide/promotion2.png";
import promotion3 from "../../assets/images/slide/promotion3.png";
import promotion4 from "../../assets/images/slide/promotion4.png";
import promotion5 from "../../assets/images/slide/promotion5.png";
import promotion6 from "../../assets/images/slide/promotion6.png";
import { twMerge } from "tailwind-merge";
import { Link, useNavigate } from "react-router";
import Button from "./Button.tsx";

const PromotionBox = [
    {
        id: 1,
        image: promotion1,
        title: "이번주 호텔/리조트 특가",
        text: "설 황금연휴 미리 예약!",
        path: "",
    },
    {
        id: 2,
        image: promotion2,
        title: "스파/온수풀 BEST 펜션",
        text: "미리 준비하는 설 연휴",
        path: "",
    },
    {
        id: 3,
        image: promotion3,
        title: "호텔 얼리버드 특가",
        text: "스마트하게 즐기는 호캉스",
        path: "",
    },
    {
        id: 4,
        image: promotion4,
        title: "서울 근교 온천/자쿠지 펜션",
        text: "가까운 곳에서 즐기는 겨울 힐링",
        path: "",
    },
    {
        id: 5,
        image: promotion5,
        title: "10만원 이하 가성비 펜션",
        text: "믿기지 않는 가격과 퀄리티!",
        path: "",
    },
    {
        id: 6,
        image: promotion6,
        title: "오늘의 플래시 특가",
        text: "딱 하루, 딱 지금만 가능한",
        path: "",
    },
];
function Promotion() {
    const navigate = useNavigate();
    return (
        <div className={"space-y-20"}>
            <div className={twMerge(["grid", "grid-cols-3", "gap-3"])}>
                {PromotionBox.map(promotionBox => (
                    <Link
                        to={promotionBox.path}
                        key={promotionBox.id}
                        className={twMerge(
                            ["w-full", "h-full"],
                            ["flex", "items-end", "p-8"],
                            ["aspect-square", "rounded-3xl", "relative", "overflow-hidden"],
                            ["group"],
                        )}>
                        <img
                            src={promotionBox.image}
                            alt={promotionBox.title}
                            className={twMerge(
                                ["absolute", "inset-0", "-z-1"],
                                ["brightness-70", "group-hover:brightness-100"],
                                ["transition-all","duration-300"]
                            )}
                        />
                        <div className={"text-white z-1"}>
                            <h3 className={"text-3xl font-bold mb-3"}>{promotionBox.title}</h3>
                            <p className={"text-xl"}>{promotionBox.text}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Button
                size={"md"}
                variant={"secondary"}
                className={"w-2/3 mx-auto"}
                onClick={() => navigate("/promotion")}>
                기획전 모음 전체보기
            </Button>
        </div>
    );
}
export default Promotion;
