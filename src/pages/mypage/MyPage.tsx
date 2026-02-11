import { twMerge } from "tailwind-merge";
import Button from "../components/Button.tsx";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import type { MouseEvent } from "react";

function MyPage() {
    const { isLoggedIn, logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleAutoClick = (e:MouseEvent<HTMLAnchorElement>) =>{
        if(!isLoggedIn){
            e.preventDefault();
            alert("로그인을 먼저 해주세요");
            navigate("/login");
        }
    }

    const handleLogout = () => {
        const confirm = window.confirm("로그아웃 하시겠습니까?");
        if (confirm) {
            logout();
            alert("로그아웃 되었습니다.");
            navigate("/");
        }
    };
    return (
        <div className={"bg-gray-100 flex-1"}>
            <div
                className={twMerge(
                    ["space-y-5", "py-10"],
                    ["max-w-[800px]", "w-full", "mx-auto"],
                )}>
                {isLoggedIn && user ? (
                    <div className={twMerge("flex", "justify-between", "items-center")}>
                        {/*로그인 했을때 보이게 작업*/}
                        <div className={"flex items-end"}>
                            <h2
                                className={twMerge(
                                    ["text-2xl", "font-bold", "text-gray-700"],
                                    ["underline", "underline-offset-8"],
                                )}>
                                {user.name}
                            </h2>
                            <span>님</span>
                        </div>
                        <div className={twMerge(["flex", "gap-4"])}>
                            <Button variant={"secondary"} size={"sm"} onClick={handleLogout}>
                                로그아웃
                            </Button>
                            <Button size={"sm"} onClick={() => navigate(`/mypage/edit`)}>
                                계정관리
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={twMerge([
                            "p-8",
                            "bg-white",
                            "rounded-xl",
                            "border",
                            "border-gray-200",
                        ])}>
                        {/*로그인 하면 안보임*/}
                        <p className={"text-gray-500 font-medium mb-2"}>신규회원 혜택 &#10024;</p>
                        <h2 className={twMerge("font-bold", "text-gray-800", "text-xl")}>
                            로그인 후 다양한
                            <br /> 회원 혜택을 만나보세요 !
                        </h2>
                        <Button
                            fullWidth={true}
                            className={"mt-8"}
                            onClick={() => navigate("/login")}>
                            로그인 또는 회원가입
                        </Button>
                    </div>
                )}
                <div className={"space-y-5"}>
                    <div
                        className={twMerge(
                            ["bg-white", "rounded-xl", "shadow-sm"],
                            ["p-4", "flex", "flex-col"],
                        )}>
                        <p
                            className={
                                "text-gray-500 font-semibold text-xs p-4 pl-2 border-b border-gray-200"
                            }>
                            예약 내역
                        </p>
                        <Link
                            onClick={handleAutoClick}
                            to={"/reservation"}
                            className={twMerge(
                                ["hover:bg-blue-50", "hover:rounded-xl"],
                                ["font-bold", "py-4", "px-2", "text-gray-800"],
                            )}>
                            국내숙소
                        </Link>
                    </div>
                    <div
                    className={twMerge(
                        ["bg-white", "rounded-xl", "shadow-sm"],
                        ["p-4", "flex", "flex-col"],
                    )}>
                        <p
                            className={
                                "text-gray-500 font-semibold text-xs p-4 pl-2 border-b border-gray-200"
                            }>
                            활동 내역
                        </p>
                    <Link
                        to={"/review"}
                        className={twMerge(
                            ["hover:bg-blue-50", "hover:rounded-xl"],
                            ["font-bold", "py-4", "px-2", "text-gray-800"],
                        )}>
                        리뷰
                    </Link>
                    <Link
                        to={"/inquiry"}
                        className={twMerge(
                            ["hover:bg-blue-50", "hover:rounded-xl"],
                            ["font-bold", "py-4", "px-2", "text-gray-800"],
                        )}>
                        1:1 문의
                    </Link>
                </div>
                    <div
                        className={twMerge(
                            ["bg-white", "rounded-xl", "shadow-sm"],
                            ["p-4", "flex", "flex-col"],
                        )}>
                        <Link
                            to={"/faq"}
                            className={twMerge(
                                ["hover:bg-blue-50", "hover:rounded-xl"],
                                ["font-bold", "py-4", "px-2", "text-gray-800"],
                            )}>
                            자주 묻는 질문
                        </Link>
                    </div>
                </div>
                {isLoggedIn && user?.role === "ADMIN" && (
                    <div className={"flex justify-end"}>
                        <Button size={"md"} onClick={() => navigate("/admin")}>
                            관리자 페이지
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default MyPage;
