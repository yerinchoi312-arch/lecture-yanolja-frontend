import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useEffect, useState } from "react";
import type { OrderItem } from "../../type/order.ts";
import { orderDetail } from "../../api/order.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";
import dayjs from "dayjs";

function ReservationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderItem | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const response = await orderDetail(String(id));
                setOrderData(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders().then(() => {});
    }, [id]);

    const handleCancel = () => {};

    if (isLoading) return <div>loading...</div>;
    if (!user || !orderData) return null;

    const totalNights = dayjs(orderData.checkOutDate).diff(dayjs(orderData.checkInDate), "day");

    return (
        <div className={"bg-gray-100 py-10"}>
            <div className={twMerge(["max-w-[800px]", "mx-auto", "w-full"])}>
                {orderData.items.map(item => (
                    <div className={"relative"} key={item.id}>
                        <BackButton className={"absolute top-2 md:hidden"} />
                        <div className={"space-y-5"}>
                            <div className={"space-y-2 bg-white p-6 rounded-xl shadow-xs"}>
                                {/*예약번호 & 예약상태*/}
                                <div className={"flex justify-between items-center"}>
                                    <div className={"text-sm text-gray-600"}>
                                        RESERVATION NO.{item.id}
                                    </div>
                                    <div className={"flex items-center gap-2"}>
                                        <div
                                            className={twMerge(
                                                ["text-xs", "py-1", "px-2", "rounded-lg"],
                                                orderData.status === "PENDING" && [
                                                    "bg-[#FFA500]/10",
                                                    "text-orange-500",
                                                ],
                                                orderData.status === "PAID" && [
                                                    "bg-[#4CAF50]/10",
                                                    "text-green-500",
                                                ],
                                                orderData.status === "CANCELED" && [
                                                    "bg-[#F44336]/10",
                                                    "text-red-500",
                                                ],
                                            )}>
                                            {orderData.status}
                                        </div><div className="flex justify-end gap-2">

                                        {orderData.status !== "CANCELED" ? (
                                            <>
                                                {/* 체크인 전: 주문 취소 가능 */}
                                                {new Date(orderData.checkInDate) > new Date() && (
                                                    <button
                                                        onClick={handleCancel}
                                                        className="border border-gray-400 px-2 py-1 rounded-md font-bold text-sm text-gray-600 cursor-pointer"
                                                    >
                                                        주문취소
                                                    </button>
                                                )}

                                                {/* 체크인 날짜 지남 & 체크아웃 전: 주문 확정 (숙박 중) */}
                                                {new Date(orderData.checkInDate) <= new Date() && new Date(orderData.checkOutDate) >= new Date() && (
                                                    <div className="bg-gray-400 px-2 py-1 rounded-md font-bold text-sm text-gray-50 cursor-default">
                                                        주문 확정
                                                    </div>
                                                )}

                                                {/* 체크아웃 날짜 지남: 리뷰 쓰기 */}
                                                {new Date(orderData.checkOutDate) < new Date() && orderData.status ==="PAID" && (
                                                    <button
                                                        onClick={() => navigate(`/review/write/${orderData.id}`)} // 경로 확인 필요
                                                        className="border border-blue-500 text-blue-600 px-2 py-1 rounded-md font-bold text-sm cursor-pointer hover:bg-blue-50"
                                                    >
                                                        리뷰쓰기
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            /* 2. 취소된 주문일 때 보여줄 UI (선택 사항) */
                                            <div className="text-red-500 font-bold text-sm">취소된 예약입니다</div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                {/*숙소명*/}
                                <h2 className={"text-xl font-bold"}>
                                    {item.roomType.product.name}
                                </h2>
                                {/*숙소상세*/}
                                <div className={"flex gap-4"}>
                                    <div className={"w-1/2"}>
                                        <img
                                            src={item.roomType.image}
                                            alt={item.roomType.name}
                                            className={"rounded"}
                                        />
                                    </div>
                                    <div>
                                        <h2 className={"text-lg font-semibold"}>
                                            {item.roomType.name}
                                        </h2>
                                        <p className={"text-base text-gray-600"}>
                                            {dayjs(orderData.checkInDate).format("YYYY.MM.DD")} ~{" "}
                                            {dayjs(orderData.checkOutDate).format("YYYY.MM.DD")}
                                            <span
                                                className={
                                                    "ml-4 pl-4 border-l border-gray-300 text-blue-700"
                                                }>
                                                {totalNights}박
                                            </span>
                                        </p>
                                        <p className={"text-sm text-gray-500"}>
                                            Guest : Adult {orderData.adultNum}, Children{" "}
                                            {orderData.childrenNum}
                                        </p>
                                    </div>
                                </div>

                                <div className={"text-blue-700 font-bold text-sm text-right"}>
                                    무료 취소
                                    {
                                        new Date(
                                            new Date(orderData.checkInDate).getTime() - 86400000,
                                        )
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    까지
                                </div>
                            </div>
                            <div className={"bg-white p-6 rounded-2xl shadow-xs space-y-3.5"}>
                                <div className={"font-semibold text-lg"}>이용자 정보</div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>이름</p>
                                    <p>{user.name}</p>
                                </div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>휴대폰 번호</p>
                                    <p>{user.phone}</p>
                                </div>
                            </div>
                            <div className={"bg-white p-6 rounded-2xl shadow-xs space-y-3.5"}>
                                <div className={"font-semibold text-lg"}>예약자 정보</div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>이름</p>
                                    <p>{orderData.recipientName}</p>
                                </div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>휴대폰 번호</p>
                                    <p>{orderData.recipientPhone}</p>
                                </div>
                            </div>
                            <div className={"bg-white p-6 rounded-2xl shadow-xs space-y-3.5"}>
                                <div className={"font-semibold text-lg"}>예약 정보</div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>예약 번호</p>
                                    <p>{orderData.id}</p>
                                </div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>예약 상품</p>
                                    <div className={"text-right flex items-center"}>
                                        <p className={"font-semibold text-lg"}>
                                            {item.roomType.product.name}
                                        </p>
                                        /
                                        <p className={"font-medium text-base"}>
                                            {item.roomType.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={"bg-white p-6 rounded-2xl shadow-xs  space-y-3.5"}>
                                <div className={"font-semibold text-lg"}>결제 금액</div>
                                <div className={"flex justify-between"}>
                                    <p className={"text-gray-600 text-base"}>상품 금액</p>
                                    <p>{item.price}</p>
                                </div>
                                <div
                                    className={
                                        "flex justify-between border-t-2 border-dashed border-gray-300 pt-4"
                                    }>
                                    <p className={"text-gray-800 text-lg font-bold"}>
                                        총 결제 금액
                                    </p>
                                    <p className={"font-bold text-xl"}>{orderData.totalPrice}</p>
                                </div>
                            </div>
                        </div>
                        <div className={"flex justify-between gap-4 mt-8"}>
                            <Button
                                className={"w-1/2"}
                                variant={"secondary"}
                                onClick={() => navigate(-1)}>
                                예약목록으로 가기
                            </Button>
                            <Button className={"w-1/2"} onClick={() => navigate("/")}>
                                홈으로 가기
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ReservationDetailPage;
