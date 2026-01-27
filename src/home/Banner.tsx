import bannerMain from "../assets/images/slide/banner_main.png";
import banner1 from "../assets/images/slide/banner1.jpg";
import banner2 from "../assets/images/slide/banner2.jpg";
import banner3 from "../assets/images/slide/banner3.jpg";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";

const BANNER = [
    {
        id: 1,
        image: banner1,
        title: "메이필드호텔 서울",
        sale: "5%",
        price: "163,590원",
        path: "/category/1",
    },
    {
        id: 2,
        image: banner2,
        title: "신라스테이 삼성",
        sale: "",
        price: "176,250원",
        path: "/category/1",
    },
    {
        id: 3,
        image: banner3,
        title: "신라스테이 광화문",
        sale: "4%",
        price: "158,000원",
        path: "/category/1",
    },
];

function Banner() {
    return (
        <div
            className={twMerge(
                ["flex"],
                ["rounded-4xl", "border", "border-gray-400"],
                ["overflow-hidden"],
            )}>
            <div className={"relative h-full aspect-square"}>
                <img src={bannerMain} alt={bannerMain} className={"object-cover brightness-80"} />
                <h3
                    className={twMerge(
                        ["absolute", "top-8", "left-8"],
                        ["text-white", "text-2xl", "font-bold"],
                    )}>
                    이번주 호텔 / 리조트 특가
                </h3>
            </div>
            <div className={twMerge(["flex", "gap-4", "p-8"])}>
                {BANNER.map(banner => (
                    <Link to={banner.path} className={twMerge(["space-y-2"])} key={banner.id}>
                        <div className={"aspect-4/5 rounded-xl overflow-hidden"}>
                            <img
                                src={banner.image}
                                alt={banner.image}
                                className={"w-full h-full object-cover"}
                            />
                        </div>
                        <h3 className={twMerge(["font-base", "text-base"])}>{banner.title}</h3>
                        <div className={twMerge(["flex", "items-center", "justify-start"])}>
                            <p className={twMerge(["font-semibold", "text-red-500", "mr-2"])}>
                                {banner.sale}
                            </p>
                            <p className={twMerge(["font-bold", "text-lg", "text-black"])}>
                                {banner.price}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
export default Banner;
