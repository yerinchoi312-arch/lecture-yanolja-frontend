import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Review } from "../../../type/review.ts";
import { adminDeleteReview, adminFetchReviews } from "../../../api/admin.review.api.ts";
import Pagination from "../../components/Pagination.tsx";
import { useNavigate } from "react-router";

function AdminReviewList() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    // 필터 및 페이징 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | "">("");

    const LIMIT = 10;

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await adminFetchReviews({
                page: currentPage,
                limit: LIMIT,
                search: search || undefined,
                rating: ratingFilter === "" ? null : Number(ratingFilter),
            });
            setReviews(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("리뷰 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage, ratingFilter]); // 페이지나 평점 필터 변경 시 자동 호출

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;
        try {
            await adminDeleteReview(String(id));
            alert("삭제되었습니다.");
            fetchReviews(); // 목록 새로고침
        } catch (error) {
            console.log(error);
            alert("삭제에 실패했습니다.");
        }
    };

    if (!loading && !reviews) return <div>데이터를 불러올 수 없습니다.</div>;
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">리뷰 관리 모드</h1>

                {/* 필터 섹션 */}
                <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <input
                        type="text"
                        placeholder="내용 또는 작성자 검색..."
                        className="border p-2 rounded w-64 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchReviews()}
                    />
                    <select
                        className="border p-2 rounded text-sm"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : "")}
                    >
                        <option value="">모든 평점</option>
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num}점</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { setCurrentPage(1); fetchReviews(); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                        검색
                    </button>
                </div>

                {/* 테이블 섹션 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            <th className="p-4 border-b">ID</th>
                            <th className="p-4 border-b">상품/객실</th>
                            <th className="p-4 border-b">작성자</th>
                            <th className="p-4 border-b w-1/3">리뷰 내용</th>
                            <th className="p-4 border-b">평점</th>
                            <th className="p-4 border-b">작성일</th>
                            <th className="p-4 border-b text-center">관리</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan={7} className="p-10 text-center">로딩 중...</td></tr>
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50 border-b"
                                    onClick={() => navigate(`/admin/reviews/${review.id}`)}>
                                    <td className="p-4">{review.id}</td>
                                    <td className="p-4">
                                        <p className="text-xs text-gray-500">{review.roomType.name}</p>
                                    </td>
                                    <td className="p-4">{review.user.name}</td>
                                    <td className="p-4">
                                        <p className="line-clamp-2">{review.content}</p>
                                        {review.images.length > 0 && (
                                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded mt-1 inline-block">
                                                    사진 {review.images.length}장
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-yellow-500">{"★".repeat(review.rating)}</td>
                                    <td className="p-4 text-gray-500">
                                        {dayjs(review.createdAt).format("YYYY-MM-DD")}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="text-red-500 hover:underline font-medium"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="p-10 text-center text-gray-400">검색 결과가 없습니다.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminReviewList;