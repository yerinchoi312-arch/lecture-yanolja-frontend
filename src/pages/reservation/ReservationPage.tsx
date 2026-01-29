import { twMerge } from "tailwind-merge";

function ReservationPage() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>예약 내역</h2>
            </div>
        </div>)
}
export default ReservationPage;