import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../../api/order.api.ts";
import type { OrderItem } from "../../type/order.ts";
import { Link } from "react-router";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Pagination from "../components/Pagination.tsx";
import TopButton from "../components/TopButton.tsx";

dayjs.locale("ko");

export const statusTheme = (status: string) => {
    switch (status) {
        case "PAID":
            return "bg-[#4CAF50]/10 text-green-500";
        case "PENDING":
            return "bg-[#FFA500]/10 text-orange-500";
        case "CANCELED":
            return "bg-[#F44336]/10 text-red-500";
    }
};

export const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
        PAID: "결제 완료",
        PENDING: "결제 대기",
        CANCELED: "취소됨",
    };
    return labels[status] || status;
};

function ReservationListPage() {
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filterStatus, setFilterStatus] = useState<string>("All");

    const LIMIT = 10;

    useEffect(() => {
        const fetchOrderList = async () => {
            setLoading(true);
            try {
                const params = {
                    page: 1,
                    limit: filterStatus === "All"? LIMIT :100,
                };
                const result = await fetchMyOrders(params);
                setOrderList(result.data);

                if(filterStatus==="All"){
                    setTotalPages(result.pagination.totalPages);
                }else {
                    setTotalPages(1)
                }

                setTotalCount(result.pagination.totalItems);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderList().then(() => {});
    }, [currentPage,filterStatus]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };
    const filteredList = orderList.filter(item => {
        if (filterStatus === "All") return true;
        return item.status === filterStatus;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className={"bg-gray-100 flex-1 py-10"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full"],
                )}>
                <h2 className={twMerge(["text-xl", "font-medium", "text-left"])}>
                    총 예약<span className={"text-2xl font-bold text-blue-500 ml-2"}>{totalCount}</span>건
                </h2>
                <div>
                    <nav className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
                        {["All", "PAID", "PENDING", "CANCELED"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={twMerge(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer",
                                    filterStatus === status
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-400 hover:bg-gray-50",
                                )}>
                                {status === "All" ? `전체 ${totalCount}` : statusLabel(status)}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={"grid grid-cols-2 gap-4"}>
                    {filteredList.length > 0 ? (
                        <>
                            {filteredList.flatMap(item =>
                                item.items.map(orderItem => (
                                    <Link
                                        to={`${item.id}`}
                                        key={orderItem.id}
                                        className={twMerge(
                                            ["flex", "flex-col", "gap-2", "rounded-xl"],
                                            ["bg-white", "px-4", "py-8", "shadow-xs"],
                                        )}>
                                        <div className={"flex flex-col gap-4"}>
                                            <div
                                                className={
                                                    "w-full aspect-video relative rounded-xl"
                                                }>
                                                <img
                                                    src={orderItem.roomType.image}
                                                    alt={orderItem.roomType.product.name}
                                                />
                                                <div
                                                    className={twMerge(
                                                        ["text-xs", "py-1", "px-2"],
                                                        [
                                                            "rounded-lg",
                                                            "absolute",
                                                            "top-2",
                                                            "right-2",
                                                        ],
                                                        item.status === "PENDING" && [
                                                            "bg-[#FFF6E6]",
                                                            "text-orange-500",
                                                        ],
                                                        item.status === "PAID" && [
                                                            "bg-[#EDF7ED]",
                                                            "text-green-500",
                                                        ],
                                                        item.status === "CANCELED" && [
                                                            "bg-[#FEEDEB]",
                                                            "text-red-500",
                                                        ],
                                                    )}>
                                                    {item.status}
                                                </div>
                                            </div>

                                            <div className={"space-y-1"}>
                                                <div className={"text-lg font-bold"}>
                                                    {orderItem.roomType.product.name}
                                                    <p
                                                        className={
                                                            "text-xs font-light text-gray-600"
                                                        }>
                                                        RESERVATION NO.{item.id}
                                                    </p>
                                                </div>
                                                <div
                                                    className={
                                                        "flex border-t border-b border-gray-200 py-2 my-2 mt-4"
                                                    }>
                                                    <div
                                                        className={
                                                            "w-1/2 border-r border-gray-200 mr-2"
                                                        }>
                                                        <p className={"text-sm font-medium"}>
                                                            일정
                                                        </p>
                                                        <p className={"text-sm text-gray-600"}>
                                                            {dayjs(item.checkInDate).format(
                                                                "YYYY.MM.DD",
                                                            )}{" "}
                                                            ~{" "}
                                                            {dayjs(item.checkOutDate).format(
                                                                "YYYY.MM.DD",
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className={"w-1/2"}>
                                                        <p className={"text-sm font-medium"}>
                                                            예약자
                                                        </p>
                                                        <p className={"text-sm text-gray-600"}>
                                                            {item.recipientName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={"text-right font-bold"}>
                                                    {item.totalPrice.toLocaleString()}원
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )),
                            )}
                        </>
                    ) : (
                        <div>
                            {filterStatus === "All"
                                ? "예약한 여행이 없습니다."
                                : `${statusLabel(filterStatus)} 내역이 없습니다.`}
                        </div>
                    )}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            <TopButton />
        </div>
    );
}
export default ReservationListPage;
