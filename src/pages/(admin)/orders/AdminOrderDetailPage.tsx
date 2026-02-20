import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { AdminOrderDetail, AdminOrderUpdate } from "../../../api/admin.order.api.ts";
import type { OrderItem, OrderState } from "../../../type/order.ts";

const STATUS_MAP: Record<OrderState, { label: string; color: string }> = {
    PENDING: { label: "대기 중", color: "text-gray-500" },
    PAID: { label: "결제 완료", color: "text-blue-600" },
    CANCELED: { label: "취소됨", color: "text-red-600" },
};

function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await AdminOrderDetail(id);
            setOrder(res.data);
        } catch (e) {
            console.error("데이터 로딩 실패:", e);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleStatusUpdate = async (newState: OrderState) => {
        if (!id || !window.confirm(`상태를 [${STATUS_MAP[newState].label}]로 변경하시겠습니까?`)) return;

        setIsUpdating(true);
        try {
            await AdminOrderUpdate(id, newState);
            alert("상태가 변경되었습니다.");
            await fetchDetail();
        } catch (e) {
            console.error(e);
            alert("상태 변경에 실패했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-gray-500 animate-pulse">정보를 불러오는 중...</div>;
    if (!order) return <div className="p-20 text-center text-gray-500">주문 내역을 찾을 수 없습니다.</div>;

    const currentStatus = STATUS_MAP[order.status] || { label: order.status, color: "text-orange-500" };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-medium"
                    >
                        <span>←</span> 목록으로 돌아가기
                    </button>

                    <div className="flex gap-2">
                        <button
                            disabled={isUpdating || order.status === "PAID"}
                            onClick={() => handleStatusUpdate("PAID")}
                            className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold disabled:bg-gray-300 transition-colors"
                        >
                            결제완료 처리
                        </button>
                        <button
                            disabled={isUpdating || order.status === "CANCELED"}
                            onClick={() => handleStatusUpdate("CANCELED")}
                            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                            예약취소
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-end">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">예약 상세 정보</h2>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Order ID: {order.id}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-white border font-bold text-sm ${currentStatus.color}`}>
                            {currentStatus.label}
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <InfoField label="예약자명" value={order.recipientName} />
                            <InfoField label="연락처" value={order.recipientPhone} />
                            <InfoField label="현재 상태" value={currentStatus.label} valueClass={`font-bold ${currentStatus.color}`} />
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-8">
                                <InfoField label="체크인" value={order.checkInDate} valueClass="text-blue-600" />
                                <InfoField label="체크아웃" value={order.checkOutDate} valueClass="text-blue-600" />
                            </div>
                            <InfoField label="예약 인원" value={`성인 ${order.adultNum}명 / 아동 ${order.childrenNum}명`} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                        예약 객실 내역
                    </h2>
                    <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl hover:bg-gray-100/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">{item.roomType?.name || "정보 없음"}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">수량: {item.quantity}개</p>
                                    </div>
                                    <p className="font-bold text-gray-900">{(item.price ?? 0).toLocaleString()}원</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-gray-400">예약된 객실 정보가 없습니다.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 flex justify-between items-center ring-1 ring-black/5">
                    <span className="text-gray-500 font-bold text-lg">총 결제 예정 금액</span>
                    <span className="text-3xl font-black text-blue-600">
                        {(order.totalPrice ?? 0).toLocaleString()}<span className="text-lg ml-1">원</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value, valueClass = "text-gray-900" }: { label: string; value: string | number; valueClass?: string }) {
    return (
        <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-tight mb-1.5">{label}</p>
            <p className={`text-lg font-medium ${valueClass}`}>{value}</p>
        </div>
    );
}

export default AdminOrderDetailPage;