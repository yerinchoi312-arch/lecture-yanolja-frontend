import { twMerge } from "tailwind-merge";
import Button from "../components/Button.tsx";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore.ts";

function MyPage() {
    const { isLoggedIn, logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirm = window.confirm("로그아웃 하시겠습니까?");
        if (confirm) {
            logout();
            alert("로그아웃 되었습니다.");
            navigate("/");
        }
    };
    return (
        <div className={twMerge(["space-y-10", "py-10"], ["max-w-[800px]", "w-full", "mx-auto"])}>
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
                    <Button fullWidth={true} className={"mt-8"} onClick={() => navigate("/login")}>
                        로그인 또는 회원가입
                    </Button>
                </div>
            )}
            <div
                className={twMerge(
                    ["bg-white", "rounded-xl", "border", "border-gray-200"],
                    ["px-8","py-2", "divide-y", "divide-gray-200"],
                    ["flex", "flex-col"],
                    ["[&>*]:py-4"],
                )}>
                <Link to={"/"}>
                    <span>예약 내역</span>
                </Link>
                <Link to={"/"}>
                    <span>기획전</span>
                </Link>
                <Link to={"/"}>
                    <span>공지사항</span>
                </Link>
                <Link to={"/"}>
                    <span>자주 묻는 질문</span>
                </Link>
            </div>
            {isLoggedIn && user?.role === "ADMIN" && (
                <div className={"flex justify-end"}>
                    <Button size={"md"} onClick={() => navigate("/admin")}>
                        관리자 페이지
                    </Button>
                </div>
            )}
        </div>
    );
}
export default MyPage;
