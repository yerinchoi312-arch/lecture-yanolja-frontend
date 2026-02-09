import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../../api/order.api.ts";
import type { OrderItem } from "../../type/order.ts";
import { Link } from "react-router";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
function ReservationListPage() {
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchOrderList = async () => {
            setLoading(true);
            try {
                const params = {
                    page: 1,
                    limit: 100,
                };
                const result = await fetchMyOrders(params);
                setOrderList(result.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderList().then(() => {});
    }, []);

    if (loading) return <div> 예약 로딩중 ...</div>

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>예약 내역</h2>
            </div>
            <div className={"grid grid-cols-2"}>
                {orderList.flatMap(item =>
                    item.items.map(orderItem => (
                        <Link
                            to={`${item.id}`}
                            key={orderItem.id}
                            className={twMerge(
                                ["flex","flex-col", "gap-1"],
                                ["bg-white", "p-4", "border", "border-gray-200"],
                            )}>
                            <div> 숙소 예약 번호 : {item.id}</div>
                            <div>{item.status}</div>
                            <div className={"flex gap-2"}>
                                <div className={"w-1/4"}>
                                    <img
                                        src={orderItem.roomType.image}
                                        alt={orderItem.roomType.product.name}
                                        className={"aspect-square rounded-xl mb-2"}
                                    />
                                </div>
                                <div>
                                    <h2 className={"text-base font-semibold"}>
                                        {orderItem.roomType.product.name}
                                    </h2>
                                    <p>
                                        {dayjs(item.checkInDate).format("YYYY.MM.DD")} ~ {dayjs(item.checkOutDate).format("YYYY.MM.DD")}
                                    </p>
                                    <p className={"w-full font-bold"}>{item.totalPrice}원</p>
                                </div>
                            </div>
                        </Link>
                    )),
                )}
            </div>
        </div>
    );
}
export default ReservationListPage;
