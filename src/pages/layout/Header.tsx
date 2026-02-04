import Logo from "../../assets/images/common/logo.svg";
import { twMerge } from "tailwind-merge";
import { Link, useNavigate } from "react-router";
import {
    IoBagHandleOutline,
    //IoHeartOutline,
    IoPersonOutline,
    IoSearchOutline,
    IoTimeOutline,
} from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/useAuthStore.ts";
import type {MouseEvent} from "react"

function Header() {
    const navigate = useNavigate();
    const { handleSubmit } = useForm();
    const {isLoggedIn}=useAuthStore();
    const onSubmit = () => {};
    const handleAutoClick = (e:MouseEvent<HTMLAnchorElement>) =>{
        if(!isLoggedIn){
            e.preventDefault();
            alert("로그인을 먼저 해주세요");
            navigate("/login");
        }
    }
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
                <Link to={"/"}
                      onClick={() => window.scrollTo({ top: 0})}>
                    <img src={Logo} alt={"logo"} />{" "}
                </Link>
                <div className={twMerge("w-full", "flex-1")}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={twMerge(["w-full", "relative"])}>
                        <input
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
                <div className={twMerge(["flex", "gap-8", "items-center", "justify-end"])}>
                    <Link to={'/mypage'}
                        className={twMerge(
                            ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                            ["font-semibold", "font-sm"],
                        )}>
                        <IoPersonOutline className={"w-7 h-7"} />
                        My
                    </Link>
                    {/*<Link to={"/wishlist"}*/}
                    {/*      onClick={handleAutoClick}*/}
                    {/*    className={twMerge(*/}
                    {/*        ["flex", "flex-col", "justify-center", "items-center", "gap-2"],*/}
                    {/*        ["font-semibold", "font-sm"],*/}
                    {/*    )}>*/}
                    {/*    <IoHeartOutline className={"w-7 h-7"} />찜*/}
                    {/*</Link>*/}
                    <Link to={"/cart"}
                          onClick={handleAutoClick}
                        className={twMerge(
                            ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                            ["font-semibold", "font-sm", "tracking-[-0.07em]"],
                        )}>
                        <IoBagHandleOutline className={"w-7 h-7"} />
                        장바구니
                    </Link>
                    <Link to={"/recent"}
                        className={twMerge(
                            ["flex", "flex-col", "justify-center", "items-center", "gap-2"],
                            ["font-semibold", "font-sm", "tracking-[-0.07em]"],
                        )}>
                        <IoTimeOutline className={"w-7 h-7"} />
                        최근 본 상품
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default Header;
