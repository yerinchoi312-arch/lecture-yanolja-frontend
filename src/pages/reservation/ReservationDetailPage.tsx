import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useEffect, useState } from "react";
import type { OrderItem } from "../../type/order.ts";
import { orderCancel, orderDetail } from "../../api/order.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";
import dayjs from "dayjs";
import { useModalStore } from "../../store/useModalStore.ts";
import { createReviewCheck } from "../../api/review.api.ts";
import { statusLabel, statusTheme } from "./ReservationListPage.tsx";

function ReservationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { openModal } = useModalStore();

    const [orderData, setOrderData] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);


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

    const handleCancel = async () => {
        if (!id || !orderData) return;

        if (!window.confirm("정말로 예약을 취소 하시겠습니까?")) return;

        const cancelReason = window.prompt("취소 사유를 입력해주세요.", "단순 변심");
        if (cancelReason === null) return;

        try {
            setIsLoading(true);
            await orderCancel(String(id), { cancelReason });
            alert("예약이 취소되었습니다.");

            const updatedResponse = await orderDetail(id);
            setOrderData(updatedResponse.data);
            return;
        } catch (e) {
            console.error(e);
            alert("취소 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>loading...</div>;
    if (!user || !orderData) return null;

    const today = dayjs();
    const checkIn = dayjs(orderData.checkInDate);
    const checkOut = dayjs(orderData.checkOutDate);
    const totalNights = checkOut.diff(checkIn, "day");

    const isBeforeCheckIn = today.isBefore(checkIn, "day");
    const isStaying =
        (today.isSame(checkIn, "day") || today.isAfter(checkIn)) && today.isBefore(checkOut, "day");
    const isAfterCheckOut = today.isAfter(checkOut, "day") || today.isSame(checkOut, "day");

    return (
        <div className={"bg-gray-100 flex-1 py-10"}>
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
                                                [
                                                    "text-xs",
                                                    "font-bold",
                                                    "py-1",
                                                    "px-2",
                                                    "rounded-md",
                                                    "flex",
                                                ],
                                                statusTheme(orderData.status),
                                            )}>
                                            {statusLabel(orderData.status)}
                                        </div>
                                        <div className="flex justify-end items-center gap-2">
                                            {orderData.status !== "CANCELED" ? (
                                                <>
                                                    {isBeforeCheckIn && (
                                                        <button
                                                            onClick={handleCancel}
                                                            className={twMerge(
                                                                "border border-gray-400 px-2 py-1",
                                                                " rounded-md cursor-pointer",
                                                                "font-bold text-sm text-gray-600",
                                                            )}>
                                                            주문취소
                                                        </button>
                                                    )}

                                                    {isStaying && (
                                                        <div
                                                            className={twMerge(
                                                                "bg-gray-400 px-2 py-1",
                                                                " rounded-md",
                                                                " font-bold text-sm text-gray-50",
                                                            )}>
                                                            주문 확정
                                                        </div>
                                                    )}

                                                    {/* 체크아웃 날짜 지남: 리뷰 쓰기 */}
                                                    {isAfterCheckOut &&
                                                        orderData.status === "PAID" && (
                                                            <div>
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            const response =
                                                                                await createReviewCheck(
                                                                                    Number(
                                                                                        item
                                                                                            .roomType
                                                                                            .id,
                                                                                    ),
                                                                                );
                                                                            if (
                                                                                response.hasReview
                                                                            ) {
                                                                                alert(
                                                                                    "리뷰가 이미 등록되었습니다.",
                                                                                );
                                                                            } else {
                                                                                openModal(
                                                                                    "REVIEW_FORM",
                                                                                    {
                                                                                        roomTypeId:
                                                                                            item
                                                                                                .roomType
                                                                                                .id,
                                                                                        productName:
                                                                                            item
                                                                                                .roomType
                                                                                                .product
                                                                                                .name,
                                                                                        productImage:
                                                                                            item
                                                                                                .roomType
                                                                                                .image,
                                                                                        roomName:
                                                                                            item
                                                                                                .roomType
                                                                                                .name,
                                                                                    },
                                                                                );
                                                                            }
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                        }
                                                                    }}
                                                                    className={twMerge(
                                                                        "border border-blue-500",
                                                                        " text-blue-600 font-bold text-sm ",
                                                                        " px-2 py-1 rounded-md cursor-pointer",
                                                                        " hover:bg-blue-50",
                                                                    )}>
                                                                    리뷰쓰기
                                                                </button>
                                                            </div>
                                                        )}
                                                </>
                                            ) : (
                                                <div className="text-red-500 font-bold text-sm">
                                                    취소된 예약입니다
                                                </div>
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
