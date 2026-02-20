import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { useEffect, useState } from "react";
import { deleteReview, fetchMyReview } from "../../api/review.api.ts";
import type { Review } from "../../type/review.ts";
import RenderStar from "../components/RenderStar.tsx";
import { Link } from "react-router";
import dayjs from "dayjs";
import Pagination from "../components/Pagination.tsx";
import { useModalStore } from "../../store/useModalStore.ts";

function MyReview() {
    const { openModal } = useModalStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 5;

    const loadReviews = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetchMyReview(page, LIMIT);
            setReviews(response.data);
            setTotalPages(response.pagination.totalPages);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews(currentPage).then(() => {});
    }, [currentPage]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };
    const handleDelete = async (reviewId: string) => {
        if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

        try {
            await deleteReview(reviewId);
            alert("리뷰가 삭제되었습니다.");
            loadReviews(currentPage).then(() => {});
        } catch (e) {
            console.log(e);
        }
    };

    const handleEdit = (review: Review) => {
        openModal("REVIEW_FORM", {
            mode: "EDIT",
            reviewId: review.id,
            initialRating: review.rating,
            initialContent: review.content,
            initialImage: review.images.map(image => image.url),
            roomName: review.roomType.name,
            productId: review.product.id,
            productName: review.product.name,
            onSuccess: () => {
                loadReviews(currentPage).then(() => {});
            },
        });
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
                        작성 리뷰 목록
                    </h2>

                    <div className={"bg-white p-8 rounded-2xl"}>
                        {reviews.length > 0 ? (
                            <>
                                {reviews.map(review => (
                                    <div
                                        key={review.id}
                                        className={twMerge(
                                            "flex flex-col",
                                            " py-4 border-b border-gray-200",
                                            "last:border-none",
                                        )}>
                                        <div className={"flex justify-between"}>
                                            <div className={"flex"}>
                                                <RenderStar rating={review.rating} />
                                            </div>
                                            <div className={"text-gray-500 text-sm"}>
                                                {dayjs(review.createdAt).format("YYYY.MM.DD")}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/products/${review.product.id}`}
                                            className={"font-bold text-lg mb-2"}>
                                            {review.product.name}
                                        </Link>
                                        <div className={"text-gray-700"}>{review.content}</div>
                                        <div className={"flex gap-2 py-2"}>
                                            {review.images.map((reviewImage, index) => (
                                                <div key={index}>
                                                    <img
                                                        onClick={() =>
                                                            openModal("IMAGE_MODAL", {
                                                                imgUrl: reviewImage.url,
                                                                alt:review.product.name
                                                            })
                                                        }
                                                        src={reviewImage.url}
                                                        className={"h-20"}
                                                        alt={review.product.name}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={"flex justify-end gap-2"}>
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className={twMerge(
                                                    "border border-gray-300",
                                                    " text-sm text-gray-500 ",
                                                    "px-2 py-1  rounded-md ",
                                                    "cursor-pointer ",
                                                )}>
                                                리뷰 수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(String(review.id))}
                                                className={twMerge(
                                                    "border border-transparent ",
                                                    " text-sm  ",
                                                    "px-2 py-1  rounded-md ",
                                                    "cursor-pointer bg-gray-500 text-white",
                                                )}>
                                                리뷰 삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div>작성한 리뷰가 존재하지 않습니다.</div>
                        )}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
}
export default MyReview;
