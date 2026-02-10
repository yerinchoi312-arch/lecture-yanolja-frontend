import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { OrderItem } from "../../type/order.ts";
import { confirmOrder } from "../../api/order.api.ts";
import { AxiosError } from "axios";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../components/Button.tsx";

function OrderSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderItem | null>(null);

    useEffect(() => {
        const orderId = searchParams.get("orderId");
        const paymentKey = searchParams.get("paymentKey");
        const amount = Number(searchParams.get("amount"));

        if (!paymentKey || !orderId || !amount) {
            navigate("/order/fail?message=잘못된 접근입니다.");
            return;
        }

        const processPayment = async () => {
            setIsLoading(true);
            try {
                const result = await confirmOrder({
                    paymentKey,
                    orderId,
                    amount,
                });

                setOrderData(result);
            } catch (e) {
                console.log("결제 검증 실패", e);
                let message = "알 수 없는 오류가 발생했습니다.";
                if (e instanceof AxiosError) message = e.response?.data.message;

                navigate(`/order/fail?message=${encodeURIComponent(message)}`);
            } finally {
                setIsLoading(false);
            }
        };
        processPayment().then(() => {});
    }, [searchParams, navigate]);

    useEffect(() => {
        console.log("서버에서 온 데이터 전체:", orderData);
    }, [orderData]);


    if (isLoading) {
        return (
            <div className={"h-[60dvh] flex flex-col items-center justify-center"}>
                <p className={"text-xl font-medium"}>결제 승인 처리중입니다...</p>
                <p className={"text-gray-500 mt-3"}>잠시만 기다려주세요.</p>
            </div>
        );
    }
    if (!orderData) {
        return <div className="h-screen flex items-center justify-center">데이터가 없습니다</div>;
    }
    return (
        <div className={"bg-gray-100 py-10 flex-1"}>
            <div className={twMerge(["max-w-[800px]", "mx-auto", "w-full"])}>
                <div className={"bg-white p-6 rounded-xl shadow-xs"}>
                    <div className={"flex flex-col gap-5 items-center py-10"}>
                        <FaCheckCircle size={40} color={"green"} />
                        <h2 className={"text-2xl font-bold"}>예약이 완료 되었습니다</h2>
                        <p className="text-gray-600 mb-10">
                            주문하신 상품의 결제가 성공적으로 완료되었습니다.
                            <br />
                            주문 상세 내역은 마이페이지에서 확인하실 수 있습니다.
                        </p>
                        <div className={"bg-gray-100 p-6 w-2/3 mx-auto rounded-xl space-y-6 text-center"}>
                            <p>예약번호 : {orderData.orderId}</p>
                            <p>예약 숙소명 : {orderData.orderName}</p>
                            <p>총 금액 : {(orderData.totalAmount).toLocaleString()}원</p>
                        </div>
                        <Button onClick={()=>navigate("/reservation")}>예약 상세보기</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderSuccess;
