import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import event1_img1 from "../../assets/images/event/event1_img1.png";
import event1_img2 from "../../assets/images/event/event1_img2.png";
import event2_img1 from "../../assets/images/event/event2_img1.png";
import event2_img2 from "../../assets/images/event/event2_img2.png";
import event3_img1 from "../../assets/images/event/event3_img1.png";
import event3_img2 from "../../assets/images/event/event3_img2.png";
import event4_img1 from "../../assets/images/event/event4_img1.png";
import event4_img2 from "../../assets/images/event/event4_img2.png";
import { useParams } from "react-router";
import TopButton from "../components/TopButton.tsx";
function EventDetailPage() {
    const { id } = useParams();

    const EVENT = [
        { id: 1, title: "설 황금연휴 펜션 할인", image: [event1_img1, event1_img2] },
        { id: 2, title: "설 황금연휴 국내여행 혜택", image: [event2_img1, event2_img2] },
        { id: 3, title: "쿠폰팩&이번주 대표 특가 호텔", image: [event3_img1, event3_img2] },
        { id: 4, title: "연휴맞이 호텔 특가", image: [event4_img1, event4_img2] },
    ];
    const currentEvent = EVENT.find(e => e.id === Number(id));
    if (!currentEvent) return null;
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"relative"}>
                <BackButton className={"absolute top-2 "} />
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center", "pb-4"])}>
                    {currentEvent.title}
                </h2>
                <div className="flex flex-col gap-0 w-full">
                    {currentEvent.image.map((img, index) => (
                        <div key={`${currentEvent.id}-${index}`} className="w-full">
                            <img
                                src={img}
                                alt={`${currentEvent.title} 상세 이미지 ${index + 1}`}
                                className="w-full h-auto block"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <TopButton />
        </div>
    );
}
export default EventDetailPage;
