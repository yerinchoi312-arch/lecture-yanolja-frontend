import { twMerge } from "tailwind-merge";
import { FaShoppingCart } from "react-icons/fa";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router";

function Cart() {
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
                <FaShoppingCart size={40} />
                <p>아직 장바구니가 비어있어요.</p>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    onClick={() => {
                        navigate("/");
                    }}>
                    담으러 가기
                </Button>
            </div>
        </div>
    );
}
export default Cart;
