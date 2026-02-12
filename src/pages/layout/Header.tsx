import Logo from "../../assets/images/common/logo.svg";
import { twMerge } from "tailwind-merge";
import { Link, useNavigate } from "react-router";
import {
    //IoBagHandleOutline,
    //IoHeartOutline,
    IoPersonOutline,
    IoSearchOutline,
    //IoTimeOutline,
} from "react-icons/io5";
import { type FormEvent, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { AiOutlineNotification } from "react-icons/ai";
// import { useAuthStore } from "../../store/useAuthStore.ts";

function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthStore();

    const [keywords, setKeywords] = useState("");

    const handleLogout = () => {
        logout();
        alert("로그아웃 되었습니다.");
        navigate("/");
    };
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!keywords.trim()) return;
        navigate(`search?keyword=${keywords}`);
        setKeywords("");
    };

    // const handleAutoClick = (e:MouseEvent<HTMLAnchorElement>) =>{
    //     if(!isLoggedIn){
    //         e.preventDefault();
    //         alert("로그인을 먼저 해주세요");
    //         navigate("/login");
    //     }
    // }
    return (
        <div
            className={twMerge(
                ["sticky", "top-0", "left-0", "right-0", "z-10"],
                ["px-8", "h-[100px]", "bg-white", "w-full"],
                ["border-b", "border-blue-300"],
            )}>
            <div
                className={twMerge(
                    ["flex", "justify-between", "items-center", "gap-10"],
                    ["max-w-[1280px]", "mx-auto", "w-full", "h-full"],
                )}>
                <div className={"flex items-center gap-10 w-4/5"}>
                    <Link to={"/"} onClick={() => window.scrollTo({ top: 0 })}>
                        <img src={Logo} alt={"logo"} />{" "}
                    </Link>
                    <div className={twMerge("w-full")}>
                        <form onSubmit={handleSearch} className={twMerge(["w-full", "relative"])}>
                            <input
                                value={keywords}
                                onChange={e => setKeywords(e.target.value)}
                                className={twMerge(
                                    ["w-full", "p-4"],
                                    ["border", "border-gray-200", "rounded-xl"],
                                    ["focus:outline-none", "font-semibold"],
                                    ["bg-blue-50"],
                                )}
                                placeholder={"어디로 떠나볼까요?"}
                            />
                            <button className={twMerge(["absolute", "right-2", "top-4"])}>
                                <IoSearchOutline className={"w-7 h-7"} />
                            </button>
                        </form>
                    </div>
                </div>
                {isLoggedIn ? (
                    <div
                        className={twMerge([
                            "flex",
                            "gap-8",
                            "items-center",
                            "justify-end",
                            "w-1/5",
                        ])}>
                        <Link
                            to={"/mypage"}
                            className={twMerge(
                                ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                                ["font-semibold", "font-sm"],
                            )}>
                            <IoPersonOutline className={"w-7 h-7"} />
                            My
                        </Link>
                        <button
                            className={twMerge(
                                ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                                ["font-semibold", "font-sm"],
                            )}
                            onClick={handleLogout}>
                            <IoIosLogOut className={"w-7 h-7"} /> 로그아웃
                        </button>
                    </div>
                ) : (
                    <div
                        className={twMerge([
                            "flex",
                            "gap-8",
                            "items-center",
                            "justify-end",
                            "w-1/5",
                        ])}>
                        <Link
                            to={"/login"}
                            className={twMerge(
                                ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                                ["font-semibold", "font-sm"],
                            )}>
                            <IoPersonOutline className={"w-7 h-7"} />
                            로그인
                        </Link>
                        <button
                            className={twMerge(
                                ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                                ["font-semibold", "font-sm"],
                            )}
                            onClick={() => navigate("/FAQ")}>
                            <AiOutlineNotification   className={"w-7 h-7"} />
                            공지사항
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Header;
