import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router";
import Button from "../components/Button.tsx";
import { MdOutlineNotes } from "react-icons/md";
function RecentView() {
    const navigate = useNavigate();
    return (
        <div className={twMerge(["py-10"], ["max-w-[1280px]", "mx-auto", "w-full"])}>
            <div
                className={twMerge([
                    "flex",
                    "flex-col",
                    "justify-center",
                    "gap-5",
                    "items-center",
                    "py-50",
                ])}>
                <MdOutlineNotes size={40} />
                <p>최근 본 상품이 없습니다.</p>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    onClick={() => {
                        navigate("/");
                    }}>
                   홈으로 가기
                </Button>
            </div>
        </div>
    );
}
export default RecentView;
