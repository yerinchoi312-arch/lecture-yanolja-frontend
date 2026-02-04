import bannerMain from "../../assets/images/slide/banner_main.png";
import banner1 from "../../assets/images/slide/banner1.jpg";
import banner2 from "../../assets/images/slide/banner2.jpg";
import banner3 from "../../assets/images/slide/banner3.jpg";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation  } from "swiper/modules";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const BANNER_SLIDE = [
    {
        id: 1,
        image: bannerMain,
        title: "이번주 호텔 / 리조트 특가",
        item: [
            {
                id: 11,
                image: banner1,
                title: "메이필드호텔 서울",
                sale: "5%",
                price: "163,590원",
                path: "/category/1",
            },
            {
                id: 12,
                image: banner2,
                title: "신라스테이 삼성",
                sale: "",
                price: "176,250원",
                path: "/category/1",
            },
            {
                id: 13,
                image: banner3,
                title: "신라스테이 광화문",
                sale: "4%",
                price: "158,000원",
                path: "/category/1",
            },
        ],
    },
    {
        id: 2,
        image: bannerMain,
        title: "이번주 펜션 / 풀빌라 특가",
        item: [
            {
                id: 21,
                image: banner1,
                title: "메이필드호텔 서울",
                sale: "5%",
                price: "163,590원",
                path: "/category/1",
            },
            {
                id: 22,
                image: banner2,
                title: "신라스테이 삼성",
                sale: "",
                price: "176,250원",
                path: "/category/1",
            },
            {
                id: 23,
                image: banner3,
                title: "신라스테이 광화문",
                sale: "4%",
                price: "158,000원",
                path: "/category/1",
            },
        ],
    },
    {
        id: 3,
        image: bannerMain,
        title: "이번주 모텔 특가",
        item: [
            {
                id: 31,
                image: banner1,
                title: "메이필드호텔 서울",
                sale: "5%",
                price: "163,590원",
                path: "/category/1",
            },
            {
                id: 32,
                image: banner2,
                title: "신라스테이 삼성",
                sale: "",
                price: "176,250원",
                path: "/category/1",
            },
            {
                id: 33,
                image: banner3,
                title: "신라스테이 광화문",
                sale: "4%",
                price: "158,000원",
                path: "/category/1",
            },
        ],
    },
];

interface BannerSlideProps {
    slideId: string;
}
function Banner({ slideId }: BannerSlideProps) {
    return (
        <div className={twMerge(["w-full", "relative"])}>
            <Swiper
                loop={true}
                slidesPerView={1}
                navigation={{
                    prevEl: `.prev-${slideId}`,
                    nextEl: `.next-${slideId}`,
                }}
                modules={[Autoplay,  Navigation]}
                className={twMerge(["w-full", "h-full"])}>
                {BANNER_SLIDE.map((bannerSlide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={twMerge(
                                ["flex", "rounded-3xl", "overflow-hidden"],
                                ["bg-blue-50", "border", "border-blue-200"],
                            )}>
                            <div className={"relative h-full aspect-square"}>
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
                                    {bannerSlide.title}
                                </h3>
                            </div>
                            <div className={"flex p-6 gap-4"}>
                                {bannerSlide.item.map((banner, index) => (
                                    <div key={index}>
                                        <Link
                                            to={banner.path}
                                            className={twMerge(["space-y-2 group"])}
                                            key={banner.id}>
                                            <div
                                                className={"aspect-4/5 rounded-xl overflow-hidden"}>
                                                <img
                                                    src={banner.image}
                                                    alt={banner.image}
                                                    className={twMerge(
                                                        ["w-full", "h-full", "object-cover"],
                                                        ["transition-all", "duration-500"],
                                                        ["group-hover:scale-105"],
                                                    )}
                                                />
                                            </div>
                                            <h3 className={twMerge(["font-base", "text-base"])}>
                                                {banner.title}
                                            </h3>
                                            <div
                                                className={twMerge([
                                                    "flex",
                                                    "items-center",
                                                    "justify-start",
                                                ])}>
                                                <p
                                                    className={twMerge([
                                                        "font-semibold",
                                                        "text-red-500",
                                                        "mr-2",
                                                    ])}>
                                                    {banner.sale}
                                                </p>
                                                <p
                                                    className={twMerge([
                                                        "font-bold",
                                                        "text-lg",
                                                        "text-black",
                                                    ])}>
                                                    {banner.price}
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
                    ["bg-white", "rounded-xl", "shadow-lg","border","border-gray-200"],
                    ["flex", "justify-center", "items-center", "w-10", "h-10",],
                    ["absolute", "-left-5", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormPrevious className={"w-8 h-8"} />
            </button>
            <button
                className={twMerge(
                    [`next-${slideId}`],
                    ["cursor-pointer"],
                    ["bg-white", "rounded-xl", "shadow-lg","border","border-gray-200"],
                    ["flex", "justify-center", "items-center", "w-10", "h-10",],
                    ["absolute", "-right-5", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormNext className={"w-8 h-8"} />
            </button>
        </div>
    );
}
export default Banner;
