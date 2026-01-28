import slideImage1 from "../../assets/images/slide/event_slide1.png";
import slideImage2 from "../../assets/images/slide/event_slide2.png";
import slideImage3 from "../../assets/images/slide/event_slide3.png";
import slideImage4 from "../../assets/images/slide/event_slide4.png";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { twMerge } from "tailwind-merge";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const SLIDES = [
    { id: 1, image: slideImage1 },
    { id: 2, image: slideImage2 },
    { id: 3, image: slideImage3 },
    { id: 4, image: slideImage4 },
];

interface SlideProps {
    id:string;
}

function EventSlide({ id }:SlideProps) {
    return (
        <div className={twMerge(["h-[250px]", "overflow-hidden", "w-full", "relative", "group"])}>
            <Swiper
                loop={true}
                slidesPerView={2}
                spaceBetween={8}
                slidesPerGroup={2}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: `.prev-${id}`,
                    nextEl: `.next-${id}`,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className={twMerge(["w-full", "h-full"])}>
                {SLIDES.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div className={twMerge(["w-full", "h-full", "relative"])}>
                            <Link to={"/event"}>
                                <img src={slide.image} alt={slide.image} />
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
                    ["absolute", "left-0", "top-1/2", "-translate-y-1/2", "z-5"],
                )}>
                <GrFormPrevious className={"w-8 h-8"} />
            </button>
            <button
                className={twMerge(
                    [`next-${id}`],
                    ["cursor-pointer"],
                    ["bg-white", "w-10", "h-10", "rounded-xl", "shadow-lg"],
                    ["flex", "justify-center", "items-center"],
                    ["absolute", "right-0", "top-1/2", "-translate-y-1/2", "z-5"],
                )}>
                <GrFormNext className={"w-8 h-8"} />
            </button>
        </div>
    );
}
export default EventSlide;
