import type { Product } from "../../type/product.ts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchProductById } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { FaStar } from "react-icons/fa";
import RoomBox from "./(room)/RoomBox.tsx";
import { FiMapPin } from "react-icons/fi";

function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
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
                        <div className={"flex items-center justify-between"}>
                            <div className={"flex items-center"}>
                                <FaStar size={20} color={"gold"} />
                                <p className={"font-bold"}>{product.ratingAvg}</p>
                                <p>({product.reviewCount.toLocaleString()})</p>
                            </div>
                            <button
                                className={"underline underline-offset-4"}
                                onClick={() => navigate("/review")}>
                                전체보기
                            </button>
                        </div>
                        <div className={"bg-gray-200 p-4"}>리뷰 보이는 영역</div>
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
                        <RoomBox product={product} />
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
