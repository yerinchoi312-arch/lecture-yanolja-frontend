import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";

function EventDetailPage() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2 md:hidden"} />
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>이벤트 상세</h2>
            </div>
        </div>)
}
export default EventDetailPage;