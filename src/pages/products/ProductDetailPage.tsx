import type { Product } from "../../type/product.ts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchProductById } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import { FaCartPlus, FaStar } from "react-icons/fa";
import Button from "../components/Button.tsx";

function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "gap-20", "py-10"],
                ["max-w-[1280px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2 md:hidden"} />

                <div className={"space-y-10"}>
                    <div className={"flex gap-2 rounded-2xl overflow-hidden"}>
                        <div className={"w-1/2 aspect-video"}>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className={"w-full h-full object-cover"}
                            />
                        </div>

                        {product.images.length > 1 && (
                            <div className={"grid grid-cols-2 w-1/2 gap-2 aspect-video"}>
                                {product.images.slice(1).map((image, i) => (
                                    <div key={i}>
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className={"w-full object-cover"}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/*숙소명*/}
                    <div>
                        <h2 className={twMerge(["text-2xl", "font-bold", "text-left", "mb-2"])}>
                            {product.name}
                        </h2>
                        <p>{product.address}</p>
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
                                onClick={() => navigate("/products/review")}>
                                전체보기
                            </button>
                        </div>
                        <div className={"bg-gray-200 p-4"}>리뷰 보이는 영역</div>
                    </div>
                    {/*객실선택*/}
                    <div className={"space-y-4"}>
                        {product.roomTypes.map(room => (
                            <div key={room.id} className={"flex gap-4"}>
                                <div className={"w-1/3"}>
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className={"rounded-2xl"}
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
                                        <p className={"text-gray-800 font-light text-lg line-through"}>
                                            {room.originPrice}원
                                        </p>
                                        <h3 className={"text-gray-800 font-bold text-xl"}>
                                           {room.price}원
                                        </h3>
                                        <div className={"flex justify-end gap-2 mt-4"}>
                                            <Button variant={"secondary"}><FaCartPlus/></Button>
                                            <Button>예약하기</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetailPage;
