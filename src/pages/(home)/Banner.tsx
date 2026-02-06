import bannerMain from "../../assets/images/slide/banner_main.png";
import bannerMain2 from "../../assets/images/slide/banner_main2.png";
import bannerMain3 from "../../assets/images/slide/banner_main3.png";
import { twMerge } from "tailwind-merge";
import { Link, useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/product.api.ts";
import type { ProductListParams, ProductSummary } from "../../type/product.ts";
import Button from "../components/Button.tsx";
import { IoIosArrowForward } from "react-icons/io";

interface BannerSlideProps {
    slideId: string;
}
function Banner({ slideId }: BannerSlideProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductSummary[]>([]);


    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                const params: ProductListParams = {
                    page:1,
                    limit: 100,};
                const response = await fetchProducts(params);
                setProducts(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        getProduct().then(() => {});
    }, []);

    const BANNER_IMAGE = [
        { image: bannerMain, title: "호텔/리조트", categoryId: 3, subCategoryId:2 },
        { image: bannerMain2, title: "펜션/풀빌라", categoryId: 4, subCategoryId:11 },
        { image: bannerMain3, title: "모텔", categoryId: 5, subCategoryId:20},
    ];

    if (loading) return <div>로딩중...</div>

    return (
        <div className={twMerge(["w-full", "relative"])}>
            <Swiper
                loop={true}
                slidesPerView={1}
                navigation={{
                    prevEl: `.prev-${slideId}`,
                    nextEl: `.next-${slideId}`,
                }}
                modules={[Autoplay, Navigation]}
                className={twMerge(["w-full", "h-full"])}>
                {BANNER_IMAGE.map((bannerSlide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={twMerge(
                                ["flex", "rounded-3xl", "overflow-hidden"],
                                ["bg-blue-50", "border", "border-blue-200"],
                            )}>
                            <div className={"relative h-full aspect-square w-1/3"}>
                                <img
                                    src={bannerSlide.image}
                                    alt={bannerSlide.title}
                                    className={"object-cover brightness-80"}
                                />
                                <h3
                                    className={twMerge(
                                        ["text-white", "font-bold", "text-3xl"],
                                        ["absolute", "top-18", "left-8"],
                                    )}>
                                    이번주 {bannerSlide.title} 특가
                                </h3>
                                <Button
                                    onClick={() =>
                                        navigate(`/categories/${bannerSlide.categoryId}/${bannerSlide.subCategoryId}`)
                                    }
                                    variant={"secondary"}
                                    size={"sm"}
                                    className={"absolute bottom-4 right-4"}>
                                    구경하기 <IoIosArrowForward />
                                </Button>
                            </div>
                            <div className={"flex p-6 gap-4 w-2/3"}>
                                {products
                                    .filter(product=>product.categoryId===bannerSlide.categoryId)
                                    .slice(0, 3)
                                    .map((product, index) => (
                                        <div key={index}>
                                            <Link
                                                to={`/products/${product.id}`}
                                                className={twMerge(["space-y-2 group"])}
                                                key={product.id}>
                                                <div
                                                    className={
                                                        "aspect-4/5 rounded-xl overflow-hidden"
                                                    }>
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className={twMerge(
                                                            ["w-full", "h-full", "object-cover"],
                                                            ["transition-all", "duration-500"],
                                                            ["group-hover:scale-105"],
                                                        )}
                                                    />
                                                </div>
                                                <h3 className={twMerge(["font-base", "text-base"])}>
                                                    {product.name}
                                                </h3>
                                                <div
                                                    className={twMerge([
                                                        "flex",
                                                        "items-center",
                                                        "justify-start",
                                                    ])}>
                                                    <p
                                                        className={twMerge([
                                                            "font-bold",
                                                            "text-lg",
                                                            "text-black",
                                                        ])}>
                                                        {(product.minPrice).toLocaleString()}원~
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
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
export default Banner;
