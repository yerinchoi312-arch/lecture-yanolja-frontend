import { FaRegStar, FaStar } from "react-icons/fa";

interface RenderStarProps {
    rating: number;
}
export function RenderStar({ rating }: RenderStarProps) {
    const star = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            star.push(<FaStar key={i} className={"text-yellow-400"} />);
        } else {
            star.push(<FaRegStar key={i} className={"text-gray-300"} />);
        }
    }
    return star;
}
export default RenderStar;