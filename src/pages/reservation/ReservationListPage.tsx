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

function ReservationListPage() {
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filterStatus, setFilterStatus] = useState<string>("All");

    const LIMIT = 10;
    const statusTheme = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-[#EDF7ED] text-green-500";
            case "PENDING":
                return "bg-[#FFF6E6] text-orange-500";
            case "CANCELED":
                return "bg-[#FEEDEB] text-red-500";
        }
    };

    const statusLabel = (status: string) => {
        const labels: Record<string, string> = {
            PAID: "결제 완료",
            PENDING: "결제 대기",
            CANCELED: "취소됨",
        };
        return labels[status] || status;
    };

    useEffect(() => {
        const fetchOrderList = async () => {
            setLoading(true);
            try {
                const params = {
                    page: filterStatus === "All" ? currentPage : 1,
                    limit: filterStatus === "All" ? LIMIT : 1000,
                };
                const result = await fetchMyOrders(params);
                setOrderList(result.data);

                if (filterStatus === "All") {
                    setTotalPages(result.pagination.totalPages);
                } else {
                    setTotalPages(1);
                }

                setTotalCount(result.pagination.totalItems);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderList().then(() => {});
    }, [currentPage, filterStatus]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };
    const filteredList = orderList.filter(item => {
        if (filterStatus === "All") return true;
        return item.status === filterStatus;
    });

    const displayCount = filterStatus === "All" ? totalCount : filteredList.length;

    const displayTotalPages =
        filterStatus === "All" ? totalPages : Math.ceil(filteredList.length / LIMIT);

    const startIndex = (currentPage - 1) * LIMIT;

    const pagedList =
        filterStatus === "All" ? filteredList : filteredList.slice(startIndex, startIndex + LIMIT);

    const handleFilterChange = (status:string)=>{
        setFilterStatus(status);
        setCurrentPage(1)
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className={"bg-gray-100 flex-1 py-10"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full"],
                )}>
                <div className={"flex justify-between items-center"}>
                    <h2 className={twMerge(["text-xl", "font-medium", "text-left"])}>
                        {filterStatus === "All" ? "총 예약" : `${statusLabel(filterStatus)}`}
                        <span className={"text-2xl font-bold text-blue-500 ml-2"}>
                            {displayCount}
                        </span>
                        건
                    </h2>
                    <nav className="flex gap-2 bg-white p-1 rounded-xl justify-start">
                        {["All", "PAID", "PENDING", "CANCELED"].map(status => (
                            <button
                                key={status}
                                onClick={() => handleFilterChange(status)}
                                className={twMerge(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer",
                                    filterStatus === status
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-400 hover:bg-gray-50",
                                )}>
                                {status === "All" ? "전체" : statusLabel(status)}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={"grid grid-cols-2 gap-4"}>
                    {pagedList.length > 0 ? (
                        <>
                            {pagedList.flatMap(item =>
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
                                                        statusTheme(item.status),
                                                    )}>
                                                    {statusLabel(item.status)}
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
                totalPages={displayTotalPages || 1}
                onPageChange={onPageChange}
            />
            <TopButton />
        </div>
    );
}
export default ReservationListPage;
