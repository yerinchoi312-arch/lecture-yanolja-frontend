import { twMerge } from "tailwind-merge";
import Button from "../components/Button.tsx";
import { Link, useNavigate } from "react-router";

function MyPage() {
    const navigate = useNavigate();
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-10", "py-10"],
                ["max-w-[800px]", "w-full", "mx-auto"],
            )}>
            {/*로그인 하면 안보임*/}
            <div
                className={twMerge(["p-8", "bg-white", "rounded-xl", "border", "border-gray-200"])}>
                <p className={"text-gray-500 font-medium mb-2"}>신규회원 혜택 &#10024;</p>
                <h2 className={twMerge("font-bold","text-gray-800","text-xl")}>로그인 후 다양한<br/> 회원 혜택을 만나보세요 !</h2>
                <Button fullWidth={true} className={"mt-8"} onClick={()=>navigate("/login")}>로그인 또는 회원가입</Button>
            </div>
            {/*로그인 했을때 보이게 작업*/}
            <div className={twMerge("flex", "justify-between")}>
                <h2
                    className={twMerge(
                        ["text-2xl", "font-bold", "text-gray-700"],
                        ["underline", "underline-offset-8"],
                    )}>
                    닉네임
                </h2>
                <Button>계정관리</Button>
            </div>
            <div
                className={twMerge(
                    ["bg-white", "rounded-xl", "border", "border-gray-200"],
                    ["p-8", "divide-y","divide-gray-200"],
                    ["flex", "flex-col"],
                    ["[&>*]:py-4",]

                )}>
                <Link to={"/"}><span>예약 내역</span></Link>
                <Link to={"/"}><span>기획전</span></Link>
                <Link to={"/"}><span>공지사항</span></Link>
                <Link to={"/"}><span>자주 묻는 질문</span></Link>
            </div>
        </div>
    );
}
export default MyPage;
