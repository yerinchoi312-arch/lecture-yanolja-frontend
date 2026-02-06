import type { Product } from "../../../type/product.ts";
import Button from "../../components/Button.tsx";

interface RoomBoxProps {
    product:Product;
}
function RoomBox({product}:RoomBoxProps) {
    return(
        <div className={"space-y-4"}>
            {product.roomTypes.map(room => (
                <div key={room.id} className={"flex gap-4"}>
                    <div className={"w-1/3 h-full aspect-video"}>
                        <img
                            src={room.image}
                            alt={room.name}
                            className={"rounded-2xl w-full h-full object-cover"}
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
                            <p
                                className={
                                    "text-gray-600 font-light text-md line-through"
                                }>
                                {(room.originPrice).toLocaleString()}원
                            </p>
                            <h3 className={"text-gray-800 font-bold text-xl"}>
                                {(room.price).toLocaleString()}원
                            </h3>
                            <div className={"flex justify-end gap-2 mt-4"}>
                                <Button>예약하기</Button>
                            </div>
                            <span className={"text-xs font-bold text-gray-500 mt-2"}>취소 및 환불 불가</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}
export default RoomBox;