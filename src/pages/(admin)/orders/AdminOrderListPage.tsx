import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // 이동을 위한 hook
import { twMerge } from "tailwind-merge";
import type { OrderItem, OrderState, Pagination } from "../../../type/order.ts";
import { AdminOrderList, AdminOrderUpdate } from "../../../api/admin.order.api.ts";

function AdminOrderListPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async (page: number) => {
        setIsLoading(true);
        try {
            const res = await AdminOrderList(page);
            setOrders(res.data);
            setPagination(res.pagination);
        } catch (e) {
            console.error("목록 로딩 실패", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
        const newState = e.target.value as OrderState;

        if (!confirm(`주문 상태를 ${newState}로 변경하시겠습니까?`)) return;
        try {
            await AdminOrderUpdate(orderId, newState);
            alert("상태가 변경되었습니다.");
            fetchOrders(currentPage);
        } catch (e) {
            console.error(e);
            alert("변경 실패");
        }
    };

    const statusStyles: Record<OrderState, string> = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PAID: "bg-green-100 text-green-700",
        CANCELED: "bg-red-100 text-red-700",
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 text-gray-800">예약/주문 통합 관리</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="p-4">예약번호 / 일시</th>
                            <th className="p-4">예약자(수령인)</th>
                            <th className="p-4">숙박 정보</th>
                            <th className="p-4">결제 금액</th>
                            <th className="p-4">상태</th>
                            <th className="p-4 text-center">관리</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-500">데이터를 불러오는 중...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-500">조회된 내역이 없습니다.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{order.id}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">{order.recipientName}</div>
                                        <div className="text-xs text-gray-500">{order.recipientPhone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-blue-600 font-semibold">
                                            {order.checkInDate} ~ {order.checkOutDate}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            성인 {order.adultNum} / 아동 {order.childrenNum}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">
                                        {order.totalPrice.toLocaleString()}원
                                    </td>
                                    <td className="p-4">
                                            <span className={twMerge(
                                                "px-2.5 py-1 rounded-full text-[11px] font-bold",
                                                statusStyles[order.status]
                                            )}>
                                                {order.status}
                                            </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className="border rounded px-2 py-1 text-xs outline-none focus:border-black bg-white"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(e, String(order.id))}
                                            >
                                                <option value="PENDING">대기</option>
                                                <option value="PAID">결제완료</option>
                                                <option value="CANCELED">취소</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 py-6 bg-white border-t">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-30 hover:bg-gray-50"
                            >
                                이전
                            </button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={twMerge(
                                        "px-3.5 py-1.5 text-sm font-bold rounded-md transition-all",
                                        currentPage === pageNum
                                            ? "bg-black text-white shadow-md"
                                            : "bg-white text-gray-600 hover:bg-gray-100 border"
                                    )}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === pagination.totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-30 hover:bg-gray-50"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminOrderListPage;