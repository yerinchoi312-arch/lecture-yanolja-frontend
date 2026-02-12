import { useModalStore } from "../../store/useModalStore.ts";
import { type ChangeEvent,useRef, useState } from "react";
import Modal from "../components/Modal.tsx";
import Button from "../components/Button.tsx";
import { createReview, updateReview } from "../../api/review.api.ts";
import { twMerge } from "tailwind-merge";
import { FaStar } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { uploadFile } from "../../api/upload.api.ts";

function ReviewModal() {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const {
        roomTypeId,
        productName,
        roomName,
        productImage,
        onSuccess,
        mode,
        reviewId,
        initialRating,
        initialContent,
        initialImage,
    } = modalProps;

    const isEditMode = mode === "EDIT";

    const [rating, setRating] = useState(initialRating || 5);
    const [content, setContent] = useState(initialContent || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [existingImage, setExistingImage] = useState<string[]>(initialImage || []);

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);
    const allPreviews = [...existingImage, ...newFilePreviews];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (existingImage.length + newFiles.length > 5) {
                alert("이미지는 최대 5장까지 등록 가능합니다.");
                return;
            }

            const newFileArr = [...newFiles, ...files];
            setNewFiles(newFileArr);

            const newPreviewArr = files.map(file => URL.createObjectURL(file));
            setNewFilePreviews([...newFilePreviews, ...newPreviewArr]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        if (indexToRemove < existingImage.length) {
            setExistingImage(prev => prev.filter((_, index) => index !== indexToRemove));
        } else {
            const newFileIndex = indexToRemove - existingImage.length;
            setNewFiles(prev => prev.filter((_, index) => index !== newFileIndex));
            setNewFilePreviews(prev => prev.filter((_, index) => index !== newFileIndex));
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("내용을 입력해주세요");
            return;
        }
        if (content.length < 5) {
            alert("리뷰를 10글자 이상 적어주세요");
            return;
        }
        setIsSubmitting(true);
        try {
            const uploadPromises = newFiles.map(file => uploadFile(file, "reviews"));
            const finalImageUrls = await Promise.all(uploadPromises);

            if (isEditMode && reviewId) {
                await updateReview(reviewId, {
                    rating,
                    content,
                    images: [...existingImage, ...finalImageUrls],
                });
            } else {
                await createReview({ roomTypeId, content, rating, images: finalImageUrls });
            }
            alert(isEditMode ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
            closeModal();
            if (onSuccess) onSuccess();

        } catch (error) {
            console.log(error);
            alert(`리뷰 ${isEditMode ? "수정" : "등록"}에 실패했습니다.`);

        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={isEditMode ? "리뷰수정" : "리뷰작성"}>
            <div className={twMerge(["py-6", "space-y-5"])}>
                {/*상품정보요약*/}
                <div
                    className={twMerge(
                        ["flex", "items-center", "gap-3"],
                        ["bg-gray-50", "rounded-sm","p-2"],
                    )}>
                    <div
                        className={twMerge(
                            ["w-15", "h-15", "rounded-sm"],
                            ["overflow-hidden"],
                        )}>
                        {productImage && (
                            <img
                                src={productImage}
                                alt={productName}
                                className={"w-full h-full object-cover"}
                            />
                        )}
                    </div>
                    <div className={"flex flex-col"}>
                        <div className={"text-sm font-bold"}>{productName}</div>
                        <div className={"text-xs font-light"}>{roomName}</div>
                    </div>
                </div>
                {/*별점선택*/}
                <div className={twMerge(["flex", "gap-2"])}>
                    {[1, 2, 3, 4, 5].map(score => (
                        <button key={score} onClick={() => setRating(score)}>
                            <FaStar
                                className={twMerge(
                                    ["text-3xl", "transition-all", "hover:scale-110"],
                                    [score <= rating ? "text-orange-400" : "text-gray-200"],
                                )}
                            />
                        </button>
                    ))}
                </div>
                {/*리뷰내용입력*/}
                <textarea
                    className={twMerge(
                        ["w-full", "h-32", "p-3"],
                        ["border", "border-gray-300", "rounded-sm", "resize-none"],
                        ["text-sm", "focus:outline-none", "focus:border-black"],
                    )}
                    placeholder={"상품에 대한 솔직한 리뷰를 남겨주세요.(최소 10자 이상)"}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                {/*사진첨부*/}
                <div>
                    {/*사진첨부버튼*/}
                    <div className={"flex items-center gap-2 mb-2"}>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={twMerge(
                                ["px-3", "py-1.5", "border", "border-gray-300", "rounded-sm"],
                                ["text-xs", "font-bold", "hover:bg-gray-50"],
                            )}>
                            사진 첨부
                        </button>
                        <input
                            type={"file"}
                            className={"hidden"}
                            accept={"image/*"}
                            multiple
                            id={"reviewImage"}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    {/*사진미리보기*/}
                    {allPreviews.length > 0 && (
                        <div className={"flex gap-2 overflow-x-auto py-2"}>
                            {allPreviews.map((url, index) => (
                                <div
                                    key={index}
                                    className={
                                        "w-16 h-16 border border-gray-100 rounded-sm relative"
                                    }>
                                    <img
                                        src={url}
                                        alt={`previews-${index}`}
                                        className={"w-full h-full object-cover"}
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className={twMerge(
                                            ["absolute", "-top-1.5", "-right-1.5"],
                                            [
                                                "w-5",
                                                "h-5",
                                                "bg-black",
                                                "text-white",
                                                "rounded-full",
                                            ],
                                            ["text-sm", "flex", "items-center", "justify-center"],
                                        )}>
                                        <FaX size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/*버튼*/}
                <div
                    className={twMerge(
                        ["p-4", "border-gray-100"],
                        ["flex", "justify-center", "gap-2"],
                    )}>
                    <Button onClick={handleSubmit} disabled={isSubmitting} fullWidth={true}>
                        {isSubmitting ? "처리중" : "등록하기"}
                    </Button>
                    <Button variant={"secondary"} fullWidth={true} onClick={closeModal}>
                        취소
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
export default ReviewModal;
