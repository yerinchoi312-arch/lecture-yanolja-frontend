import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import { useOrderStore } from "../../store/useOrderStore.ts";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { CreateOrderRequest } from "../../type/order.ts";
import { createOrder } from "../../api/order.api.ts";
import { useModalStore } from "../../store/useModalStore.ts";
import dayjs from "dayjs";

interface OrderFormData {
    recipientName: string;
    recipientPhone: string;
    checkInDate: string;
    checkOutDate: string;
    adultNum: number;
    childrenNum: number;
    deliveryRequestType: string;
    deliveryRequestDirect: string;
}

function OrderDetail() {
    const { user } = useAuthStore();
    const { orderItems, getTotalPrice } = useOrderStore();
    const { openModal } = useModalStore();
    const [adultNum, setAdultNum] = useState(1);
    const [childrenNum, setChildrenNum] = useState(0);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const currentOrder = orderItems[0];

    const totalNights = dayjs(checkOutDate).diff(dayjs(checkInDate), 'day');
    const TotalPrice = totalNights > 0 ? totalNights * getTotalPrice() : getTotalPrice();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<OrderFormData>();

    const onSubmit = async (data: OrderFormData) => {
        try {
            const orderInput: CreateOrderRequest = {
                adultNum: Number(data.adultNum),
                childrenNum: Number(data.childrenNum || 0),
                checkInDate: data.checkInDate,
                checkOutDate: data.checkOutDate,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                items: orderItems.flatMap(orderItem =>
                    orderItem.items.map(item => ({
                        roomTypeId: item.roomType.id,
                        quantity: item.quantity,
                    })),
                ),
            };

            const createdOrder = await createOrder(orderInput);

            const originOrderId = String(createdOrder.data.orderId);
            const newOrderId = `${new Date().getTime()}_${originOrderId}`;

            openModal("PAYMENT", {
                orderNumber: newOrderId,
                orderName: createdOrder.data.orderName,
                customerName: createdOrder.data.customerName,
                customerEmail: createdOrder.data.customerEmail,
                amount: TotalPrice,
            });
        } catch (e) {
            console.log(e);
            alert("주문생성 중 오류가 발생했습니다.");
        }
        return;
    };

    useEffect(() => {
        if (user) {
            reset({
                recipientName: user.username,
                recipientPhone: user.phone,
            });
        }
    }, [user]);

    const handelCheckDate = (e: ChangeEvent<HTMLInputElement>) => {
        const Date = e.target.value;
        setCheckInDate(Date);
        if (checkOutDate && Date >= checkOutDate) {
            setCheckOutDate("");
        }
    };

    if (orderItems.length === 0) {
        return (
            <div className={"bg-gray-100 py-10 flex-1 h-full"}>
                <div
                    className={twMerge(
                        ["flex", "flex-col", "gap-20"],
                        ["max-w-[800px]", "mx-auto", "w-full"],
                    )}>
                    <div className={"font-medium"}>주문할 상품 정보가 없습니다.</div>
                </div>
            </div>
        );
    }

    return (
        <div className={"bg-gray-100 py-10"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-20"],
                    ["max-w-[800px]", "mx-auto", "w-full"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2 md:hidden"} />

                    <form className={"space-y-6"} onSubmit={handleSubmit(onSubmit)}>
                        <div className={"space-y-6 bg-white p-6 rounded-2xl shadow-xs"}>
                            <div>
                                <h2 className={"font-bold text-xl mb-1"}>
                                    {currentOrder.items[0].roomType.product.name}
                                </h2>
                                <p className={"font-medium text-gray-700 text-lg"}>
                                    {currentOrder.items[0].roomType.name}
                                </p>
                            </div>
                            <div
                                className={
                                    "flex justify-between divide-x divide-gray-200  bg-gray-50 py-4 rounded-xl"
                                }>
                                <div
                                    className={
                                        "w-1/2 flex flex-col items-center justify-center gap-2"
                                    }>
                                    <p className={"font-bold text-xs text-gray-500"}>체크인</p>
                                    <div className={"flex"}>
                                        <input
                                            {...register("checkInDate", {
                                                required: "체크인 날짜를 선택하세요",
                                            })}
                                            className={"focus:outline-none"}
                                            type={"date"}
                                            value={checkInDate}
                                            onChange={handelCheckDate}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                        <div className={"font-bold"}>
                                            {currentOrder.checkInDate}
                                        </div>
                                    </div>
                                    {errors.checkInDate && (
                                        <p className={"text-red-500 text-sm"}>
                                            {errors.checkInDate.message}
                                        </p>
                                    )}
                                </div>
                                <div
                                    className={
                                        "w-1/2 flex flex-col items-center justify-center gap-2"
                                    }>
                                    <p className={"font-bold text-xs text-gray-500"}>체크아웃</p>
                                    <div className={"flex"}>
                                        <input
                                            {...register("checkOutDate", {
                                                required: "체크아웃 날짜를 선택하세요",
                                                validate: value => {
                                                    if (value <= checkInDate) {
                                                        return "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.";
                                                    }
                                                    return;
                                                },
                                            })}
                                            className={"focus:outline-none"}
                                            type={"date"}
                                            value={checkOutDate}
                                            min={
                                                checkInDate ||
                                                new Date().toLocaleString().split("T")[0]
                                            }
                                            onChange={e => setCheckOutDate(e.target.value)}
                                        />
                                        <div className={"font-bold"}>
                                            {currentOrder.checkOutDate}
                                        </div>
                                    </div>
                                    {errors.checkOutDate && (
                                        <p className={"text-red-500 text-sm"}>
                                            {errors.checkOutDate.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div
                                className={
                                    "flex justify-between divide-x divide-gray-200 bg-gray-50 py-4 rounded-xl"
                                }>
                                <div
                                    className={
                                        "w-1/2 flex flex-col items-center justify-center gap-2"
                                    }>
                                    <p className={"font-bold text-xs text-gray-500"}>성인</p>
                                    <input
                                        {...register("adultNum", {
                                            required: "인원을 입력해주세요.",
                                        })}
                                        type={"number"}
                                        className={"text-center"}
                                        min={1}
                                        max={10}
                                        value={adultNum}
                                        onChange={e => setAdultNum(Number(e.target.value))}
                                    />
                                </div>
                                <div
                                    className={
                                        "w-1/2 flex flex-col items-center justify-center gap-2"
                                    }>
                                    <p className={"font-bold text-xs text-gray-500"}>아이</p>
                                    <input
                                        {...register("childrenNum")}
                                        type={"number"}
                                        className={"text-center"}
                                        min={0}
                                        max={10}
                                        value={childrenNum}
                                        onChange={e => setChildrenNum(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className={"text-right"}>
                                <div className={"flex justify-end text-lg"}>
                                    <p className={"font-bold "}>
                                        {currentOrder.totalPrice.toLocaleString()}{" "}
                                    </p>
                                    원
                                </div>
                                {!checkInDate ? (
                                    <div></div>
                                ) : checkInDate === new Date().toISOString().split("T")[0] ? (
                                    <p className={"text-blue-700 font-bold text-sm"}>
                                        당일예약은 취소 및 환불이 불가능합니다.
                                    </p>
                                ) : (
                                    <p className={"text-blue-700 font-bold text-sm"}>
                                        무료취소 (
                                        {
                                            new Date(new Date(checkInDate).getTime() - 86400000)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        ) 23:59까지
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={"space-y-2 bg-white p-6 rounded-2xl shadow-xs"}>
                            <h2 className={"font-bold"}>
                                예약자 정보<span className={"text-red-500"}>*</span>
                            </h2>
                            <p>
                                {user?.name} / {user?.phone}
                            </p>
                        </div>
                        <div className={"space-y-4 bg-white p-6 rounded-2xl shadow-xs"}>
                            <h2 className={"font-bold"}>
                                이용자 정보<span className={"text-red-500"}>*</span>
                            </h2>
                            <Input
                                label={"이름"}
                                placeholder={"이름"}
                                registration={register("recipientName", {
                                    required: "이름은 필수 입니다.",
                                })}
                                error={errors.recipientName}
                            />
                            <Input
                                label={"전화번호"}
                                placeholder={"010-0000-0000"}
                                registration={register("recipientPhone", {
                                    required: "전화번호는 필수입니다.",
                                    pattern: {
                                        value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                                        message: "올바른 형식이 아닙니다",
                                    },
                                })}
                                error={errors.recipientPhone}
                            />
                        </div>
                        <div className={"space-y-4 bg-white p-6 rounded-2xl shadow-xs"}>
                            <div className={"flex items-center gap-1"}>
                                <h2 className={"font-bold"}>결제 금액</h2>
                                <span className={"text-xs"}>(세금 및 봉사료 포함)</span>
                            </div>
                            <div className={"flex justify-between items-center"}>
                                <p>상품 금액 (총 {totalNights}일)</p>
                                <p>{TotalPrice.toLocaleString()}원</p>
                            </div>
                            <div className={"border-b-2 border-dashed border-gray-200 my-4"} />
                            <div className={"flex justify-between items-center"}>
                                <p className={"font-bold text-xl"}>총 결제 금액</p>
                                <p className={"font-bold text-xl text-blue-500"}>
                                    {TotalPrice.toLocaleString()}원
                                </p>
                            </div>
                        </div>
                        <Button fullWidth={true} type={"submit"}>
                            결제 하기
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default OrderDetail;
