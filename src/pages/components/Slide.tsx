import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { twMerge } from "tailwind-merge";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import type { ProductListParams, ProductSummary } from "../../type/product.ts";
import {  fetchProducts } from "../../api/product.api.ts";

interface SlideProps {
    slideId: string;
    categoryId?: number;
    subCategoryId?: number;
}
function Slide({ slideId ,categoryId=0,subCategoryId}: SlideProps) {
    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const randomArray = (array: any[]) => {
        return [...array].sort(()=>Math.random() - 0.5);
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const params: ProductListParams = {
                    page: 1,
                    limit: 10,
                    ...(categoryId > 0 && { categoryId: Number(categoryId) }),
                    ...(subCategoryId && { subCategoryId: Number(subCategoryId) }),
                };

                const response = await fetchProducts(params);
                const shuffled = randomArray(response.data)

                setProducts(shuffled);
                //setPagination(response.pagination);

            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct().then(() => {});
    }, [categoryId,subCategoryId]);


    if (loading) return <div>로딩중</div>;


    return (
        <div className={twMerge(["w-full", "relative"])}>
            <Swiper

                loop={true}
                slidesPerView={5}
                spaceBetween={16}
                slidesPerGroup={5}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: `.prev-${slideId}`,
                    nextEl: `.next-${slideId}`,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className={twMerge(["w-full", "h-full"])}>
                {products.map(product => (

                    <SwiperSlide key={product.id} className={"!h-[330px]"}>
                        <div
                            className={twMerge([
                                "w-full",
                                "h-full",
                                "relative",
                                "overflow-hidden",
                            ])}>
                            <Link to={`/products/${product.id}`} className={twMerge(["space-y-2 group"])}>
                                <div className={"aspect-square rounded-xl overflow-hidden"}>
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className={twMerge(
                                            ["w-full", "h-full", "object-cover"],
                                            ["transition-all", "duration-500"],
                                            ["group-hover:scale-110"],
                                        )}
                                    />
                                </div>
                                <h3 className={twMerge(["font-base", "text-base"])}>
                                    {product.name}
                                </h3>
                                <div className={twMerge(["flex", "items-center", "justify-start"])}>
                                    <p
                                        className={twMerge([
                                            "font-semibold",
                                            "text-red-500",
                                            "mr-2",
                                        ])}>
                                        {product.minPrice}
                                    </p>
                                    <p className={twMerge(["font-bold", "text-lg", "text-black"])}>
                                        {product.minPrice}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className={twMerge(
                    [`prev-${slideId}`],
                    ["cursor-pointer"],
                    ["bg-white", "rounded-xl", "shadow-lg", "border", "border-gray-200"],
                    ["flex", "justify-center", "items-center", "w-10", "h-10"],
                    ["absolute", "-left-5", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormPrevious className={"w-8 h-8"} />
            </button>
            <button
                className={twMerge(
                    [`next-${slideId}`],
                    ["cursor-pointer"],
                    ["bg-white", "rounded-xl", "shadow-lg", "border", "border-gray-200"],
                    ["flex", "justify-center", "items-center", "w-10", "h-10"],
                    ["absolute", "-right-5", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormNext className={"w-8 h-8"} />
            </button>
        </div>
    );
}
export default Slide;
