import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchUsers } from "../../api/admin.user.api.ts";
import { AdminOrderList } from "../../api/admin.order.api.ts";
import { adminFetchReviews } from "../../api/admin.review.api.ts";

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        orderCount: 0,
        reviewCount: 0,
        pendingOrderCount: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [usersRes, ordersRes, reviewsRes] = await Promise.all([
                    fetchUsers({ page: 1, limit: 100 }),
                    AdminOrderList(1),
                    adminFetchReviews({ page: 1, limit: 100 })
                ]);

                const orderArray = (ordersRes as any).data || (Array.isArray(ordersRes) ? ordersRes : []);
                const reviewArray = (reviewsRes as any).data || (reviewsRes as any).reviews || (Array.isArray(reviewsRes) ? reviewsRes : []);
                const userArray = (usersRes as any).data || (Array.isArray(usersRes) ? usersRes : []);

                setStats({
                    userCount: userArray.length,
                    orderCount: orderArray.length,
                    reviewCount: reviewArray.length,
                    pendingOrderCount: orderArray.filter((o: any) => o.status === "PENDING" || o.status === "대기중").length,
                });

                setRecentOrders(orderArray.slice(0, 5));

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if(isLoading) return <div>loading,,,</div>

    return (
        <div className="p-8 bg-gray-50 min-h-screen space-y-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900">관리자 센터</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="회원 관리" value={`${stats.userCount}명`} label="현재 등록된 회원" color="text-blue-600" />
                <StatCard title="주문 관리" value={`${stats.orderCount}건`} label="전체 주문 내역" color="text-indigo-600" />
                <StatCard title="리뷰 관리" value={`${stats.reviewCount}개`} label="작성된 후기" color="text-orange-500" />
                <StatCard title="확인 필요" value={`${stats.pendingOrderCount}건`} label="대기 중인 주문" color="text-red-500" />
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">최근 주문 현황</h2>
                    <button onClick={() => navigate("/admin/orders")} className="text-sm font-bold text-gray-400">전체보기</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">주문자</th>
                            <th className="px-8 py-4">상품명</th>
                            <th className="px-8 py-4">상태</th>
                            <th className="px-8 py-4 text-right">상세보기</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {recentOrders.map((order, idx) => (
                            <tr key={order.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-gray-900">{order.recipientName}</td>
                                <td className="px-8 py-5 text-sm text-gray-500">{order.items?.[0]?.roomType?.name || "상품 정보 없음"}</td>
                                <td className="px-8 py-5">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                      {order.status}
                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        className="text-xs font-bold text-gray-300 hover:text-black transition-colors"
                                    >
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, label, color }: any) {
    return (
        <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900">{value}</h3>
                <span className={`text-xs font-bold ${color}`}>{label}</span>
            </div>
        </div>
    );
}

export default AdminDashboard;