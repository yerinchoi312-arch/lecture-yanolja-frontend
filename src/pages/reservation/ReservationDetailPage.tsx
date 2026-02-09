import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useEffect, useState } from "react";
import type { OrderItem } from "../../type/order.ts";
import { OrderDetail } from "../../api/order.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";

function ReservationDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderItem | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const response = await OrderDetail(String(id));
                setOrderData(response);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders().then(() => {});
    }, [id]);

    useEffect(() => {
        if (orderData) {
            console.log("실제 들어온 데이터:", orderData);
        }
    }, [orderData]);
    if (!user) return null;
    return (
        <div className={"bg-gray-100 py-10"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-20"],
                    ["max-w-[800px]", "mx-auto", "w-full"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2 md:hidden"} />
                    <div className={"bg-white p-6 rounded-2xl shadow-xs"}>
                        <div>
                            <h2>예약이 완료되었습니다.</h2>
                            <p>예약 일시 : {orderData?.id} </p>
                        </div>
                        <div> 배너 </div>
                        <div>
                            <div>상품 정보</div>
                            <div>
                                <p>숙소 예약 번호 :</p>
                                <h2>숙소 이름</h2>
                                <div className={"flex justify-between"}>
                                    <div>숙소 사진</div>
                                    <div>
                                        <p>방이름</p>
                                        <p>체크인 날짜</p> ~ <p>체크아웃 날짜</p> (체크아웃날짜 -
                                        체크인 날짜)
                                        <p>사람 수</p>
                                    </div>
                                </div>
                            </div>
                            <div>무료 취소 (체크인시간하루전) 까지</div>
                        </div>
                        <div>
                            <div>예약자 정보</div>
                            <div className={"flex justify-between"}>
                                <p>이름</p>
                                <p>{user.name}</p>
                            </div>
                            <div className={"flex justify-between"}>
                                <p>휴대폰 번호</p>
                                <p>{user.phone}</p>
                            </div>
                        </div>
                        <div>
                            <div>이용자 정보</div>
                            <div className={"flex justify-between"}>
                                <p>이름</p>
                                <p>user.name</p>
                            </div>
                            <div className={"flex justify-between"}>
                                <p>휴대폰 번호</p>
                                <p>user.phone</p>
                            </div>
                        </div>
                        <div>
                            <div>예약 정보</div>
                            <div className={"flex justify-between"}>
                                <p>예약 번호</p>
                                <p>orderId</p>
                            </div>
                            <div className={"flex justify-between"}>
                                <p>예약 상품</p>
                                <p>product.name</p>
                            </div>
                        </div>
                        <div>
                            <div>결제 금액</div>
                            <div className={"flex justify-between"}>
                                <p>상품 금액</p>
                                <p>totalPrice</p>
                            </div>
                        </div>
                        <div className={"flex justify-between"}>
                            <p>총 결제 금액</p>
                            <p>totalPrice</p>
                        </div>
                    </div>

                    <Button className={"flex justify-end"}>홈으로 가기</Button>
                </div>
            </div>
        </div>
    );
}
export default ReservationDetailPage;