import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import { useOrderStore } from "../../store/useOrderStore.ts";

function OrderDetail() {
    const { user } = useAuthStore();
    const { orderItems, getTotalPrice } = useOrderStore();

    const TotalPrice = getTotalPrice();
    const currentOrder = orderItems[0]

    console.log(currentOrder);

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

                    <h2 className={"font-bold mb-8 text-2xl"}>주문하기</h2>
                    <form className={"space-y-6"}>
                        <div className={"space-y-4 bg-white px-6 py-4 rounded-2xl shadow-xs"}>
                            <div>
                                <h2 className={"font-bold text-xl mb-1"}>{currentOrder.items[0].roomType.product.name}</h2>
                                <p className={"font-semibold text-lg"}>{currentOrder.items[0].roomType.name}</p>
                            </div>
                            <div className={"flex justify-between"}>
                                <div className={"w-1/2 flex flex-col"}>
                                    <p className={"font-light text-xs text-gray-500"}>체크인</p>
                                    <p className={"font-bold"}>{currentOrder.checkInDate}</p>
                                </div>
                                <div className={"w-1/2 flex flex-col"}>
                                    <p className={"font-light text-xs text-gray-500"}>체크아웃</p>
                                    <p className={"font-bold"}>{currentOrder.checkOutDate}</p>
                                </div>
                            </div>
                            <div className={"flex text-gray-500 font-base"}>
                                <p>CreateOrderRequest adultNum</p>,
                                <p>CreateOrderRequest childrenNum</p>
                            </div>
                            <div className={"text-right"}>
                                <div className={"flex justify-end"}>
                                    <p className={"font-bold"}>{currentOrder.totalPrice} </p>원
                                </div>
                                <p className={"text-green-900 font-bold text-sm"}>
                                    무료취소 (checkInDate)전 까지
                                </p>
                            </div>
                        </div>
                        <div className={"space-y-2 bg-white px-6 py-4 rounded-2xl shadow-xs"}>
                            <h2 className={"font-bold"}>
                                예약자 정보<span className={"text-red-500"}>*</span>
                            </h2>
                            <p>
                                {user?.name} / {user?.phone}
                            </p>
                        </div>
                        <div className={"space-y-4 bg-white px-6 py-4 rounded-2xl shadow-xs"}>
                            <h2 className={"font-bold"}>
                                이용자 정보<span className={"text-red-500"}>*</span>
                            </h2>
                            <Input label={"이름"} />
                            <Input label={"전화번호"} />
                        </div>
                        <div className={"space-y-4 bg-white px-6 py-4 rounded-2xl shadow-xs"}>
                            <div className={"flex items-center gap-1"}>
                                <h2 className={"font-bold"}>결제 금액</h2>
                                <span className={"text-xs"}>(세금 및 봉사료 포함)</span>
                            </div>
                            <div className={"flex justify-between items-center"}>
                                <p>상품 금액</p>
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
