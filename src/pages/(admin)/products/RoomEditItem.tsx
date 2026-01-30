import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaTrash } from "react-icons/fa";
import type { RoomType } from "../../../type/product.ts";
import { uploadFile } from "../../../api/upload.api.ts";
import { deleteRoomType, updateRoomType } from "../../../api/admin.product.api.ts";

interface Props {
    room: RoomType;
    onDeleteSuccess: (roomId: number) => void; // 삭제 성공 시 부모에게 알림
}

interface RoomFormValues {
    name: string;
    description: string;
    originPrice: number;
    price: number;
    image: FileList; // 새 이미지 파일 (선택 사항)
}

const RoomEditItem = ({ room, onDeleteSuccess }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit } = useForm<RoomFormValues>({
        defaultValues: {
            name: room.name,
            description: room.description,
            originPrice: room.originPrice,
            price: room.price,
        },
    });

    const onSubmit = async (data: RoomFormValues) => {
        try {
            setIsSubmitting(true);
            let imageUrl = room.image; // 기본값: 기존 URL

            // 1. 새 이미지가 있다면 업로드
            if (data.image && data.image.length > 0) {
                imageUrl = await uploadFile(data.image[0], "rooms");
            }

            // 2. 개별 객실 업데이트 API 호출
            await updateRoomType(room.id, {
                name: data.name,
                description: data.description,
                originPrice: Number(data.originPrice),
                price: Number(data.price),
                image: imageUrl,
            });

            alert("객실 정보가 수정되었습니다.");
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 객실을 삭제하시겠습니까?")) return;
        try {
            await deleteRoomType(room.id);
            onDeleteSuccess(room.id);
        } catch (error) {
            console.error(error);
            alert("삭제 실패");
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4 relative">
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    🏠 {room.name}{" "}
                    <span className="text-xs font-normal text-gray-500">(ID: {room.id})</span>
                </h4>
                <button
                    onClick={handleDelete}
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition p-1"
                    title="객실 삭제">
                    <FaTrash />
                </button>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 왼쪽: 이미지 미리보기 및 변경 */}
                <div>
                    <div className="aspect-video bg-gray-200 rounded-md overflow-hidden mb-2 relative group">
                        <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs">
                            현재 이미지
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-white file:text-blue-600 border rounded"
                    />
                </div>

                {/* 오른쪽: 정보 입력 */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500">객실명</label>
                        <input
                            {...register("name", { required: true })}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500">설명</label>
                        <input
                            {...register("description")}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500">
                                정상가
                            </label>
                            <input
                                type="number"
                                {...register("originPrice", { required: true, min: 0 })}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500">
                                판매가
                            </label>
                            <input
                                type="number"
                                {...register("price", { required: true, min: 0 })}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-1 bg-white border border-blue-600 text-blue-600 px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition disabled:opacity-50">
                            <FaSave /> {isSubmitting ? "저장 중" : "변경 저장"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RoomEditItem;
