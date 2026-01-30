import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useNavigate } from "react-router";

function NoticeList() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    return (
        <div className={"bg-gray-50"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10","gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2 md:hidden"} />
                    <h2 className={twMerge(["text-2xl", "font-bold", "mb-8", "text-center"])}>
                        공지사항
                    </h2>
                    {user?.role === "ADMIN" && (
                        <div className={"flex justify-end"}>
                            <Button size={"sm"} onClick={() => navigate("write")}>
                                글쓰기
                            </Button>
                        </div>
                    )}
                </div>
                <div className={"bg-white"}>
                    <ul>
                        <li>dasdas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default NoticeList;
