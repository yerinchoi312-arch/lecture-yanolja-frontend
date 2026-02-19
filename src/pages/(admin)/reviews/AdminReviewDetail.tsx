import { useEffect, useState } from "react";
import { adminFetchReviews, adminDeleteReview } from "../../../api/admin.review.api.ts";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import type { Review } from "../../../type/review.ts";

function AdminReviewDetail() {
    const { id } = useParams(); // URL에서 ID 추출
    const navigate = useNavigate();

    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDetail = async () => {
            setLoading(true);
            try {
                // 1. 우선 리스트를 크게 가져옵니다 (limit을 늘려서 해당 ID가 포함되게 함)
                const result = await adminFetchReviews({
                    page: 1,
                    limit: 100 // 일단 넉넉히 가져와서 찾기
                });

                console.log("전체 데이터:", result.data); // 데이터가 어떻게 오는지 확인
                console.log("찾으려는 ID:", id);

                // 2. 가져온 배열에서 URL의 reviewId와 일치하는 항목 찾기
                // review.id가 숫자형일 수 있으므로 타입 체크 주의!
                const target = result.data.find((r: Review) => String(r.id) === String(id));

                if (target) {
                    setReview(target);
                } else {
                    console.error("해당 ID의 리뷰를 리스트에서 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("상세 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getDetail();
        }
    }, [id]);

    const handleDelete = async () => {
        if (!id || !window.confirm("이 리뷰를 영구 삭제하시겠습니까?")) return;
        try {
            await adminDeleteReview(id);
            alert("리뷰가 삭제되었습니다.");
            navigate("/admin/reviews"); // 삭제 후 목록으로 이동
        } catch (error) {
            console.error(error);
            alert("삭제 처리 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <div className="p-10 text-center">상세 정보 로딩 중...</div>;
    if (!review) return <div className="p-10 text-center">리뷰를 찾을 수 없습니다.</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* 상단 네비게이션 */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-black flex items-center gap-2"
                    >
                        ← 목록으로 돌아가기
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                    >
                        리뷰 삭제
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    {/* 섹션 1: 작성자 및 상품 정보 */}
                    <div className="p-8 border-b grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">작성자 정보</h3>
                            <p className="text-lg font-bold">{review.user?.name || "익명 사용자"}</p>
                            <p className="text-gray-500 text-sm">작성일: {dayjs(review.createdAt).format("YYYY.MM.DD HH:mm")}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">대상 상품 정보</h3>
                            <p className="text-lg font-bold text-blue-600">{review.product?.name}</p>
                            <p className="text-gray-500 text-sm">객실: {review.roomType?.name}</p>
                        </div>
                    </div>

                    {/* 섹션 2: 평점 및 내용 */}
                    <div className="p-8 border-b">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl text-yellow-500">{"★".repeat(review.rating)}</span>
                            <span className="text-xl font-bold text-gray-700">{review.rating}점</span>
                        </div>
                        <div className="text-gray-800 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl italic">
                            "{review.content}"
                        </div>
                    </div>

                    {/* 섹션 3: 첨부 이미지 */}
                    {review.images && review.images.length > 0 && (
                        <div className="p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">첨부된 사진 ({review.images.length})</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {review.images.map((img) => (
                                    <div key={img.id} className="rounded-xl overflow-hidden border shadow-sm">
                                        <img
                                            src={img.url}
                                            alt="리뷰 첨부 이미지"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminReviewDetail;