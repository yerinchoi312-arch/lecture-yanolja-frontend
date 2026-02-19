import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { fetchReview } from "../../api/review.api.ts";
import type { Review, ReviewSort } from "../../type/review.ts";
import RenderStar from "../components/RenderStar.tsx";
import { useParams } from "react-router";
import dayjs from "dayjs";
import Pagination from "../components/Pagination.tsx";
import Select from "../components/Select.tsx";

function ReviewDetail() {
    const { id } = useParams();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort,setSort] = useState<ReviewSort>("latest");
    const LIMIT = 10;

    const getReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: LIMIT,
                sort:sort
            };
            const response = await fetchReview(Number(id), params);
            setReviews(response.data);
            setTotalPages(response.pagination.totalPages);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, [id, currentPage, sort]);

    useEffect(() => {
        getReviews().then(() => {});
    }, [getReviews]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value as ReviewSort;
        setSort(newSort);
        setCurrentPage(1)
    }
    if (loading) return <div>loading,,,</div>;

    return (
        <div className={"bg-gray-100"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2"} />
                    <h2
                        className={twMerge(
                            ["text-2xl", "font-semibold", "flex", "justify-center", "items-center"],
                            ["mb-8"],
                        )}>
                        {reviews[0]?.product.name} 리뷰 (<strong>{reviews.length}</strong>)개
                    </h2>
                    <div
                        className={"flex justify-end mb-4"}>
                        <Select
                            className={"bg-white p-3"}
                            value={sort}
                            onChange={handleSortChange}
                            options={[
                                { value: "latest", label: "최신순" },
                                { value: "rating_desc", label: "별점 내림차순" },
                                { value: "rating_asc", label: "별점 올림차순" },
                            ]}
                        />
                    </div>

                    {reviews.map((review, index) => {
                        const displayIndex = (currentPage - 1) * LIMIT + (index + 1);
                        const name = review.user.name;
                        const maskedName =
                            name.length === 3
                                ? name[0] + "*" + name[2]
                                : name.length > 3
                                  ? name[0] + "*".repeat(name.length - 2) + name.slice(-1)
                                  : name[0] + "*";
                        return (
                            <div key={index}>
                                <div className={"bg-white p-8 rounded-2xl"}>
                                    <div
                                        className={twMerge(
                                            "flex flex-col",
                                            " py-4 border-b border-gray-200",
                                            "last:border-none",
                                        )}>
                                        <div className={"flex justify-between mb-2"}>
                                            <div className={"flex items-center gap-2"}>
                                                <div>{displayIndex}) </div>
                                                <div className={"flex"}>
                                                    <RenderStar rating={review.rating} />
                                                </div>
                                                <div
                                                    className={"font-medium text-gray-500 text-sm"}>
                                                    {maskedName}님
                                                </div>
                                            </div>
                                            <div className={"text-gray-500 text-sm"}>
                                                {dayjs(review.createdAt).format("YYYY.MM.DD")}
                                            </div>
                                        </div>
                                        <div className={"text-gray-700 text-sm mt-4"}>
                                            {review.roomType.name}
                                        </div>
                                        <div className={"text-gray-700 my-2"}>
                                            {review.content}
                                        </div>
                                        {review.images.length > 0 && (
                                            <div className={"flex gap-2"}>
                                                {review.images.map((image, index) => (
                                                    <div
                                                        key={index}
                                                        className={
                                                            "aspect-video h-20 overflow-hidden"
                                                        }>
                                                        <img
                                                            src={image.url}
                                                            alt={review.product.name}
                                                            className={"object-cover h-full"}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
export default ReviewDetail;
