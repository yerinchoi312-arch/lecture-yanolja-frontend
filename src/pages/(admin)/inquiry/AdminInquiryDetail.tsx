import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Inquiry } from "../../../type/inquiry.ts";
import { adminInquiryDetail, adminUpdateInquiry } from "../../../api/inquiry.api.ts";

function AdminInquiryDetail() {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        const getDetail = async () => {
            const res = await adminInquiryDetail(String(id));
            setInquiry(res.data);
            // 만약 기존 답변이 있다면 상태에 미리 넣어줍니다 (수정 시 편리)
            if (res.data.answer) {
                setAnswer(res.data.answer);
            }
        };
        getDetail();
    }, [id]);

    const submitAnswer = async () => {
        await adminUpdateInquiry(String(id), { answer });
        alert("답변이 등록되었습니다.");
        window.location.reload();
    };

    if (!inquiry) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-10">
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold border-b pb-4">{inquiry.title}</h2>
                <div className="py-6 min-h-[200px] whitespace-pre-wrap">{inquiry.content}</div>

                {/* 답변 영역 */}
                <div className="mt-10 pt-10 border-t">
                    <h3 className="font-bold mb-4">
                        {inquiry.answer ? "등록된 답변" : "답변 작성하기"}
                    </h3>

                    {/* 답변이 이미 있을 때 보여주는 뷰 */}
                    {inquiry.answer && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border text-gray-800 whitespace-pre-wrap">
                            {inquiry.answer}
                        </div>
                    )}

                    {/* 답변 수정 또는 새로 작성할 때 사용하는 입력창 */}
                    <div className="flex flex-col">
                        <textarea
                            className="w-full border p-4 rounded-lg h-32 focus:ring-1 focus:ring-black outline-none"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="고객님께 남길 답변을 입력하세요."
                        />
                        <button
                            onClick={submitAnswer}
                            className="mt-4 bg-black text-white px-6 py-2 rounded-md self-end"
                        >
                            {inquiry.answer ? "답변 수정하기" : "답변 완료"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminInquiryDetail