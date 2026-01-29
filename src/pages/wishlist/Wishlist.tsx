import { twMerge } from "tailwind-merge";
import { FaHeart } from "react-icons/fa";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router";

function Wishlist() {
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
                    "py-50"
                ])}>
                <FaHeart  size={40} />
                <p>아직 찜한 상품이 없어요.</p>
                <Button variant={"secondary"} size={"sm"} onClick={()=>{navigate("/promotion")}}>
                    기획전 둘러보기
                </Button>
            </div>
        </div>
    );
}
export default Wishlist;
