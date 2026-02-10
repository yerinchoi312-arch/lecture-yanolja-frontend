import { useNavigate, useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";
import {  FaExclamationCircle } from "react-icons/fa";
import Button from "../components/Button.tsx";

function OrderFail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
            <div className={"bg-gray-100 py-10 flex-1"}>
                <div className={twMerge(["max-w-[800px]", "mx-auto", "w-full"])}>
                    <div className={"bg-white p-6 rounded-xl shadow-xs"}>
                        <div className={"flex flex-col gap-5 items-center py-10"}>
                            <FaExclamationCircle  size={40} color={"red"} />
                            <h2 className={"text-2xl font-bold"}>예약이 실패 되었습니다</h2>
                            <p className="text-gray-600 mb-10 text-center">
                                결제 진행 중 오류가 발생했거나 취소 되었습니다.
                            <br/>
                                다시 시도해주세요.
                            </p>
                            <div className={"bg-gray-100 p-6 w-2/3 rounded-xl space-y-6 text-center"}>
                                <p>오류 내용</p>
                                <p>{message || "알 수 없는 오류가 발생했습니다."}</p>
                                <p>{code && <p className={"text-gray-500"}>({code})</p>}</p>
                            </div>
                            <Button variant={"secondary"} onClick={() => navigate("/categories/3/2")}>다시 주문하기</Button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default OrderFail;
