import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AdminOrderDetail, AdminOrderUpdate } from "../../../api/admin.order.api.ts";
import type { OrderItem, OrderState } from "../../../type/order.ts";

function AdminOrderDetailPage() {
    // 1. useParams로 가져오는 id는 기본적으로 string입니다.
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDetail = async () => {
        if (!id) return; // id가 없으면 실행 안 함
        setIsLoading(true);
        try {
            // 2. id(string)를 그대로 API에 전달
            const res = await AdminOrderDetail(id);

            // 만약 서버 데이터가 { data: { ... } } 구조라면 res.data로 세팅
            // console.log("상세 데이터 확인:", res);
            setOrder(res.data);
        } catch (e) {
            console.error("데이터 로딩 실패:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleStatusUpdate = async (newState: OrderState) => {
        if (!id) return;
        try {
            // 3. 수정 시에도 id(string)를 사용
            await AdminOrderUpdate(id, newState);
            alert("상태가 변경되었습니다.");
            fetchDetail();
        } catch (e) {
            console.error(e);
            alert("상태 변경 실패",);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-gray-500">정보를 불러오는 중...</div>;
    if (!order) return <div className="p-20 text-center text-gray-500">주문 내역을 찾을 수 없습니다.</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* 상단 헤더 */}
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black transition-colors">
                        ← 목록으로 돌아가기
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate("PAID")} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">결제완료</button>
                        <button onClick={() => handleStatusUpdate("CANCELED")} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold">취소처리</button>
                    </div>
                </div>

                {/* 주문 정보 카드 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">예약 상세 정보</h2>
                        <p className="text-sm text-gray-400 mt-1">식별 ID: {order.id}</p>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div><p className="text-xs text-gray-400 uppercase font-bold">예약자명</p><p className="text-lg font-medium">{order.recipientName}</p></div>
                            <div><p className="text-xs text-gray-400 uppercase font-bold">연락처</p><p className="text-lg font-medium">{order.recipientPhone}</p></div>
                            <div><p className="text-xs text-gray-400 uppercase font-bold">현재 상태</p><p className="text-lg font-bold text-orange-500">{order.status}</p></div>
                        </div>
                        <div className="space-y-4">
                            <div><p className="text-xs text-gray-400 uppercase font-bold">체크인</p><p className="text-lg font-medium text-blue-600">{order.checkInDate}</p></div>
                            <div><p className="text-xs text-gray-400 uppercase font-bold">체크아웃</p><p className="text-lg font-medium text-blue-600">{order.checkOutDate}</p></div>
                            <div><p className="text-xs text-gray-400 uppercase font-bold">인원</p><p className="text-lg font-medium">성인 {order.adultNum} / 아동 {order.childrenNum}</p></div>
                        </div>
                    </div>
                </div>

                {/* 예약 객실 목록 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4">예약 객실</h2>
                    <div className="space-y-3">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-900">{item.roomType?.name}</p>
                                    <p className="text-xs text-gray-500">수량: {item.quantity}개</p>
                                </div>
                                <p className="font-black text-gray-900">{(item.price ?? 0).toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 총 결제금액 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                    <span className="text-gray-500 font-bold">총 결제 금액</span>
                    <span className="text-2xl font-black text-blue-600">{(order.totalPrice ?? 0).toLocaleString()}원</span>
                </div>
            </div>
        </div>
    );
}

export default AdminOrderDetailPage;