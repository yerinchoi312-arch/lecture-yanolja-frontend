import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination.tsx";
import { fetchMyInquiries } from "../../api/inquiry.api.ts";
import type { Inquiry, InquiryStatus, InquiryType } from "../../type/inquiry.ts";
import dayjs from "dayjs";

function InquiryList() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const LIMIT = 10;

    useEffect(() => {
        const loadInquiries = async (page: number) => {
            setLoading(true);
            try {
                const response = await fetchMyInquiries(page, LIMIT);
                setInquiries(response.data);
                setTotalPages(response.pagination.totalPages);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadInquiries(currentPage).then(() => {});
    }, [currentPage]);

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
                <div className={"px-2 py-1 text-xs font-bold text-white bg-black rounded-sm inline-block"}>
                    답변 완료
                </div>
            );
        } else {
            return (
                <div
                    className={"px-2 py-1 text-xs font-bold text-gray-500 bg-gray-200 rounded-sm inline-block"}>
                    답변 대기
                </div>
            );
        }
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };
    if (loading) return <div>loading,,,</div>;
    return (
        <div className={"bg-gray-100"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2 md:hidden"} />
                    <h2 className={twMerge(["text-2xl", "font-bold", "mb-8", "text-center"])}>
                        1:1 문의
                    </h2>
                    <div className={"flex justify-end"}>
                        <Button size={"sm"} onClick={() => navigate("write")}>
                            글쓰기
                        </Button>
                    </div>
                </div>
                {inquiries.length > 0 ? (
                    <>
                        <div className={"bg-white rounded-2xl shadow p-8"}>
                            <div
                                className={twMerge(
                                    ["flex items-center"],
                                    [" pb-4 px-2 w-full"],
                                    ["border-b-2 border-gray-500"],
                                )}>
                                <div className={"flex gap-2 items-center w-2/3"}>
                                    <div className={"text-sm font-bold text-gray-700 w-24"}>
                                        문의 유형
                                    </div>
                                    <h2 className={"text-sm font-bold text-gray-700 flex-1"}>문의 제목</h2>
                                </div>
                                <div className={"text-sm font-bold text-gray-700 w-1/6 text-center"}>문의 상태</div>
                                <div className={"text-sm font-bold text-gray-700 w-1/6 text-center"}>작성일</div>
                            </div>
                            {inquiries.map((inquiry, index) => (
                                <Link
                                    to={`/inquiry/${inquiry.id}`}
                                    key={index}
                                    className={twMerge(
                                        ["flex items-center"],
                                        ["w-full p-4 px-2"],
                                        ["border-b border-gray-300"],
                                        ["hover:bg-blue-50"],
                                    )}>
                                    <div className={"flex items-center gap-2 w-2/3"}>
                                        <div className={"w-24"}>
                                            <p
                                                className={twMerge(
                                                    [
                                                        "bg-blue-400 font-semibold text-white text-xs",
                                                    ],
                                                    ["rounded-sm px-2 py-1 inline"],
                                                )}>
                                                {TypeLabel(inquiry.type)}
                                            </p>
                                        </div>
                                        <h2 className={"text-sm font-medium text-gray-700"}>
                                            {inquiry.title}
                                        </h2>
                                    </div>
                                    <div className={"w-1/6 text-center"}>{renderStatusBadge(inquiry.status)}</div>
                                    <div className={"w-1/6 text-center"}>{dayjs(inquiry.createdAt).format("YYYY.MM.DD")}</div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={"bg-white rounded-2xl shadow p-8"}>
                        <div>작성된 문의사항이 없습니다.</div>
                    </div>
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}
export default InquiryList;
