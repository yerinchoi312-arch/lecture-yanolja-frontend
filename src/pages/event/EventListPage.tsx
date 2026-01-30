import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";

function EventListPage() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"relative"}>
                <BackButton className={"absolute top-2 md:hidden"} />
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>이벤트 전체</h2>
            </div>
        </div>
    );
}
export default EventListPage;
