import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import type { Inquiry, InquiryStatus, InquiryType } from "../../type/inquiry.ts";
import { useNavigate, useParams } from "react-router";
import { inquiryDetail } from "../../api/inquiry.api.ts";
import dayjs from "dayjs";
import Button from "../components/Button.tsx";

function InquiryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadInquiry = async () => {
            setLoading(true);
            try {
                const response = await inquiryDetail(String(id));
                setInquiry(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadInquiry().then(() => {});
    }, [id]);
    console.log(inquiry);
    const TypeLabel = (type: InquiryType) => {
        const map: Record<InquiryType, string> = {
            RESERVATION: "예약 문의",
            PRODUCT: "상품 문의",
            EXCHANGE_RETURN: "교환/환불 문의",
            MEMBER: "회원 문의",
            OTHER: "기타 문의",
        };
        return map[type];
    };

    const renderStatusBadge = (status: InquiryStatus) => {
        if (status === "ANSWERED") {
            return (
                <div className={"px-2 py-1 text-xs font-bold text-white bg-black rounded-sm"}>
                    답변 완료
                </div>
            );
        } else {
            return (
                <div
                    className={"px-2 py-1 text-xs font-bold text-gray-500 bg-gray-200 rounded-sm"}>
                    답변 대기
                </div>
            );
        }
    };

    if (loading) return <div>문의내역 불러오는 중...</div>;
    if (!inquiry) return <div className="p-10 text-center">문의 내역을 찾을 수 없습니다.</div>;

    return (
        <div className={"bg-gray-50"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <div className={"relative"}>
                    <div className={"bg-white p-8 rounded-2xl shadows"}>
                        <div className={"w-full mb-5"}>
                            {/*내문의내용*/}
                            <div className={"flex gap-2 items-center w-full"}>
                                <div
                                    className={twMerge(
                                        ["bg-blue-400 font-semibold text-white text-xs"],
                                        ["rounded-sm px-2 py-1"],
                                    )}>
                                    {TypeLabel(inquiry.type)}
                                </div>
                                <div>{renderStatusBadge(inquiry.status)}</div>
                            </div>
                            <div
                                className={"flex justify-between items-center border-b w-full p-4"}>
                                <div className={"text-gray-700 font-bold text-xl"}>
                                    {inquiry.title}
                                </div>
                                <div>{dayjs(inquiry.createdAt).format("YYYY-MM-DD HH:mm")}</div>
                            </div>
                            <div className={"p-4 min-h-50"}>
                                <div className={"flex justify-end"}>
                                    {!inquiry.answer && (
                                        <button
                                            onClick={() => navigate(`/inquiry/edit/${inquiry.id}`)}
                                            className={
                                                "border py-1 px-2 text-sm rounded border-gray-400 font-semibold text-gray-600"
                                            }>
                                            문의 수정
                                        </button>
                                    )}
                                </div>
                                {inquiry.content}
                                {inquiry?.images.length > 0 && (
                                    <div className={"flex gap-2 items-center mt-2"}>
                                        {inquiry.images.map((image, index) => (
                                            <div key={index} className={"w-30 h-30"} >
                                                <img src={image.url} alt={"image.id"} className={"object-cover"} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            {/*답변내용*/}
                            {inquiry?.answer ? (
                                <div className={"bg-blue-50 p-8 rounded-xl"}>
                                    <div className={" border-l-2 pl-3 border-blue-400"}>
                                        <h2 className={"font-semibold mb-4"}>관리자 답변</h2>
                                        <div>{inquiry.answer}</div>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <div className={"flex justify-end mt-5"}>
                            <Button onClick={() => navigate(-1)}>목록으로</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default InquiryDetail;
