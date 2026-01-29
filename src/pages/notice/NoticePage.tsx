import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";

function NoticePage() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "py-10"],
                ["max-w-[800px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2 md:hidden"}/>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4", "text-center"])}>
                    공지사항
                </h2>
            </div>
        </div>
    );
}
export default NoticePage;
