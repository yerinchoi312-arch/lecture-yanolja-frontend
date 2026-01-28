import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
interface BackButtonProps{
    className?: string;
}
function BackButton({className}: BackButtonProps) {
    const navigate = useNavigate();
    return(
        <button className={twMerge(["cursor-pointer"],className)} onClick={()=>navigate(-1)}>
            <IoIosArrowBack size={24} />
        </button>
    )
}
export default BackButton