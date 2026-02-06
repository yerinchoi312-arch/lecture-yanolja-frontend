import type { Product } from "../../../type/product.ts";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore.ts";
import { useOrderStore } from "../../../store/useOrderStore.ts";
import type { OrderItem } from "../../../type/order.ts";

interface RoomBoxProps {
    product:Product;
}
function RoomBox({product}:RoomBoxProps) {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuthStore()
    const {setOrderItems}=useOrderStore()

    const handleClick = (room) => {
        if(!isLoggedIn){
            alert("로그인을 먼저 해주세요");
            navigate("/login");
            return;
        }

        const orderData : OrderItem ={
            id: room.id,
            createdAt: room.createdAt,
            totalPrice: room.price,
            status: "PENDING",
            recipientName: "",
            checkInDate: "14:00",
            checkOutDate: "11:00",
            items: [
                {
                    id: room.id,
                    roomType: {
                        id: room.id,
                        name: room.name,
                        image: room.image,
                        product:{
                           name: room.name
                        }
                    },
                    quantity: 1,
                    price: room.price,
                },
            ],
        }
        setOrderItems([orderData])

        navigate("/order");
        scrollTo(0,0)


    }
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
                                <Button onClick={()=>handleClick(room)}>예약하기</Button>
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