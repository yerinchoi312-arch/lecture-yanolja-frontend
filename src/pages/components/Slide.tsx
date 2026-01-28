import slide1 from "../../assets/images/slide/slide1.jpg";
import slide2 from "../../assets/images/slide/slide2.jpg";
import slide3 from "../../assets/images/slide/slide3.jpg";
import slide4 from "../../assets/images/slide/slide4.png";
import slide5 from "../../assets/images/slide/slide5.jpg";
import slide6 from "../../assets/images/slide/slide6.jpg";
import slide7 from "../../assets/images/slide/slide7.jpg";
import slide8 from "../../assets/images/slide/slide8.jpg";
import slide9 from "../../assets/images/slide/slide9.jpg";
import slide10 from "../../assets/images/slide/slide10.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { twMerge } from "tailwind-merge";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const SLIDES = [
    { id: 1, image: slide1 , title:"호텔 탑스텐 정동진", sale:"8%", price:"92,000원 ~", path: "/category/1"},
    { id: 2, image: slide2 , title:"강릉 세인트존스호텔", sale:"45%", price:"110,000원 ~" , path: "/category/1"},
    { id: 3, image: slide3 , title:"스카이베이 호텔 경포", sale:"", price:"108,900원 ~" , path: "/category/1"},
    { id: 4, image: slide4 , title:"SL호텔 강릉", sale:"72%", price:"54,600원 ~" , path: "/category/1"},
    { id: 5, image: slide5 , title:"정동진 썬크루즈 호텔", sale:"20%", price:"176,000원 ~" , path: "/category/1"},
    { id: 6, image: slide6 , title:"호텔 탑스텐 정동진", sale:"8%", price:"92,000원 ~", path: "/category/1"},
    { id: 7, image: slide7 , title:"강릉 세인트존스호텔", sale:"45%", price:"110,000원 ~" , path: "/category/1"},
    { id: 8, image: slide8 , title:"스카이베이 호텔 경포", sale:"", price:"108,900원 ~" , path: "/category/1"},
    { id: 9, image: slide9 , title:"SL호텔 강릉", sale:"72%", price:"54,600원 ~" , path: "/category/1"},
    { id: 10, image: slide10 , title:"정동진 썬크루즈 호텔", sale:"20%", price:"176,000원 ~" , path: "/category/1"},
];

interface SlideProps {
    id:string;
}
function Slide({id}:SlideProps) {
    return (
        <div className={twMerge(["overflow-hidden", "w-full", "relative", "group"])}>
            <Swiper
                loop={true}
                slidesPerView={5}
                spaceBetween={16}
                slidesPerGroup={5}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: `.prev-${id}`,
                    nextEl: `.next-${id}`,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className={twMerge(["w-full", "h-full"])}>
                {SLIDES.map(slide => (
                    <SwiperSlide key={slide.id} className={"!h-[330px]"}>
                        <div
                            className={twMerge([
                                "w-full",
                                "h-full",
                                "relative",
                                "overflow-hidden",
                            ])}>
                            <Link to={slide.path} className={twMerge(["space-y-2"])}>
                                <div className={"aspect-square rounded-xl overflow-hidden"}>
                                    <img
                                        src={slide.image}
                                        alt={slide.image}
                                        className={"w-full h-full object-cover"}
                                    />
                                </div>
                                <h3 className={twMerge(["font-base", "text-base"])}>
                                    {slide.title}
                                </h3>
                                <div className={twMerge(["flex", "items-center", "justify-start"])}>
                                    <p
                                        className={twMerge([
                                            "font-semibold",
                                            "text-red-500",
                                            "mr-2",
                                        ])}>
                                        {slide?.sale}
                                    </p>
                                    <p className={twMerge(["font-bold", "text-lg", "text-black"])}>
                                        {slide.price}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className={twMerge(
                    [`prev-${id}`],
                    ["cursor-pointer"],
                    ["bg-white", "w-10", "h-10", "rounded-xl", "shadow-lg"],
                    ["flex", "justify-center", "items-center"],
                    ["absolute", "left-0", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormPrevious className={"w-8 h-8"} />
            </button>
            <button
                className={twMerge(
                    [`next-${id}`],
                    ["cursor-pointer"],
                    ["bg-white", "w-10", "h-10", "rounded-xl", "shadow-lg"],
                    ["flex", "justify-center", "items-center"],
                    ["absolute", "right-0", "top-[calc(50%-20px)]", "z-5"],
                )}>
                <GrFormNext className={"w-8 h-8"} />
            </button>
        </div>
    );
}
export default Slide;
