import type { Product, RoomType } from "../../type/product.ts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchProductById } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import Button from "../components/Button.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useOrderStore } from "../../store/useOrderStore.ts";
import type { OrderItem } from "../../type/order.ts";
import { fetchReview } from "../../api/review.api.ts";
import type { Review } from "../../type/review.ts";
import dayjs from "dayjs";
import RenderStar from "../components/RenderStar.tsx";

function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoggedIn } = useAuthStore();
    const { setOrderItems } = useOrderStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState("");

    const scrollToId = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
        setIsActive(id);
    };
    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            if (!id) return null;
            try {
                const response = await fetchProductById(Number(id));
                setProduct(response);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        getProduct().then(() => {});
    }, [id]);

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true);
            try {
                const params={page:1,limit:4}
                const response = await fetchReview(Number(id),params);
                setReviews(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        getReviews().then(() => {});
    }, [id]);

    const handleClick = (room: RoomType) => {
        if (!isLoggedIn) {
            alert("로그인을 먼저 해주세요");
            navigate("/login");
            return;
        }
        if (!product) return;

        const orderData: OrderItem = {
            id: room.id,
            createdAt: new Date().toISOString(),
            totalPrice: room.price,
            status: "PENDING",
            recipientName: "",
            checkInDate: "14:00",
            checkOutDate: "11:00",
            items: [
                {
                    id: room.id,
                    roomType: {
                        id: room.id,
                        name: room.name,
                        image: room.image,
                        product: {
                            name: product.name,
                        },
                    },
                    quantity: 1,
                    price: room.price,
                },
            ],
            adultNum: 0,
            childrenNum: 0,
            recipientPhone: "",
        };
        setOrderItems([orderData]);

        navigate("/order");
        scrollTo(0, 0);
    };

    if (!product) return <div>상품이 없습니다.</div>;
    if (loading) return <div>로딩 중...</div>;

    const TAPS = [
        { id: "room", label: "객실 선택" },
        { id: "location", label: "위치/교통" },
        { id: "info", label: "숙소 소개" },
        { id: "notice", label: "공지사항" },
    ];

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2 md:hidden"} />

                <div className={"space-y-10"}>
                    {product.images.length > 1 ? (
                        <div className={"flex gap-2 rounded-2xl overflow-hidden"}>
                            <div className={"w-1/2 aspect-video"}>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={"w-full h-full object-cover"}
                                />
                            </div>
                            <div className={"grid grid-cols-2 w-1/2 gap-2 aspect-video"}>
                                {product.images.slice(1, 5).map((image, i) => (
                                    <div key={i}>
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className={"w-full object-cover"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={"flex gap-2 rounded-2xl overflow-hidden"}>
                            <div className={"w-1/2 aspect-video"}>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={"w-full h-full object-cover rounded-2xl"}
                                />
                            </div>
                        </div>
                    )}
                    {/*숙소명*/}
                    <div>
                        <h2 className={twMerge(["text-2xl", "font-bold", "text-left", "mb-2"])}>
                            {product.name}
                        </h2>
                        <p>{product.address.split(" ").slice(0, 2).join(" ")}</p>
                    </div>
                    {/*리뷰*/}
                    <div className={"border border-gray-200 rounded-2xl shadow-md p-8 space-y-6"}>
                        {reviews.map(review => {
                            const name = review.user.name;
                            const maskedName =
                                name.length === 3
                                    ? name[0] + "*" + name[2]
                                    : name.length > 3
                                      ? name[0] + "*".repeat(name.length - 2) + name.slice(-1)
                                      : name[0] + "*";
                            return (
                                <div key={review.id}>
                                    <div className={"flex items-center justify-between mb-2"}>
                                        <div className={"flex items-center"}>
                                            <FaStar size={20} color={"gold"} />
                                            <p className={"font-bold text-lg"}>
                                                {product.ratingAvg}
                                            </p>
                                            <p className={"text-xs"}>
                                                ({product.reviewCount.toLocaleString()})
                                            </p>
                                        </div>
                                        <button onClick={() => navigate(`/review/${product.id}`)}>
                                            전체보기
                                        </button>
                                    </div>
                                    <div className={"bg-gray-100 rounded-2xl p-4"}>
                                        <div className={"flex gap-2"}>
                                            <div
                                                className={
                                                    "bg-white w-1/4 space-y-2 p-4 rounded-xl"
                                                }>
                                                <div
                                                    className={
                                                        "flex items-center justify-between gap-1"
                                                    }>
                                                    <div className={"flex"}>
                                                        <RenderStar rating={review.rating} />
                                                    </div>

                                                    <p className={"text-gray-500 text-sm"}>
                                                        {dayjs(review.createdAt).format(
                                                            "YYYY.MM.DD",
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={"text-gray-700 mb-2"}>
                                                        {review.content}
                                                    </p>
                                                    <div
                                                        className={
                                                            "h-20 overflow-hidden aspect-video"
                                                        }>
                                                        {review.images.length > 0 && (
                                                            <img
                                                                src={review.images?.[0]?.url}
                                                                alt={review.product.name}
                                                                className={"object-cover"}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={"text-xs text-right"}>
                                                    {maskedName}님
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {reviews.length===0 &&<div>아직 리뷰가 없습니다.</div>}

                    </div>
                    {/*객실선택*/}
                    <nav
                        className={twMerge(
                            ["flex", "gap-4", "py-4"],
                            ["w-full", "sticky", "top-25"],
                            ["bg-white", "border-b", "border-gray-300"],
                        )}>
                        {TAPS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToId(tab.id)}
                                className={twMerge(
                                    isActive === tab.id && ["text-blue-500", "font-bold"],
                                )}>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className={"space-y-4"} id={"room"}>
                        <h2 className={"font-semibold text-lg"}>객실 선택</h2>

                        <div className={"space-y-4"}>
                            {product.roomTypes.map(room => (
                                <div key={room.id} className={"flex gap-4"}>
                                    <div className={"w-1/3 h-full aspect-video"}>
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className={"rounded-2xl w-full h-full object-cover"}
                                        />
                                    </div>
                                    <div
                                        className={
                                            "w-2/3 flex flex-col justify-between border rounded-2xl border-gray-200 p-4"
                                        }>
                                        <div className={"space-y-1"}>
                                            <h3 className={"text-xl font-semibold"}>{room.name}</h3>
                                            <p>{room.description}</p>
                                        </div>
                                        <div className={"text-right pb-4 "}>
                                            <p
                                                className={
                                                    "text-gray-600 font-light text-md line-through"
                                                }>
                                                {room.originPrice.toLocaleString()}원
                                            </p>
                                            <h3 className={"text-gray-800 font-bold text-xl"}>
                                                {room.price.toLocaleString()}원
                                            </h3>
                                            <div className={"flex justify-end gap-2 mt-4"}>
                                                <Button onClick={() => handleClick(room)}>
                                                    예약하기
                                                </Button>
                                            </div>
                                            <span
                                                className={"text-xs font-bold text-gray-500 mt-2"}>
                                                당일 취소 및 환불 불가
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={"space-y-4"} id={"location"}>
                        <h2 className={"font-semibold text-lg"}>위치/교통</h2>
                        <div className={"flex items-center gap-2"}>
                            <FiMapPin size={14} />
                            {product.address}
                        </div>
                    </div>
                    <div className={"space-y-4"} id={"info"}>
                        <h2 className={"font-semibold text-lg"}>숙소 소개</h2>
                        <div>{product.description}</div>
                    </div>
                    <div className={"space-y-4"} id={"notice"}>
                        <h2 className={"font-semibold text-lg"}>예약 공지</h2>
                        <div>{product.notice}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetailPage;
