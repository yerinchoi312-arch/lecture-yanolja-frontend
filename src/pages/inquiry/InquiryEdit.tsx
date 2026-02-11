import { twMerge } from "tailwind-merge";
import Select from "../components/Select.tsx";
import type { InquiryType } from "../../type/inquiry.ts";
import Input from "../components/Input.tsx";
import { GoPlus } from "react-icons/go";
import { FaTimes } from "react-icons/fa";
import Button from "../components/Button.tsx";
import { useNavigate, useParams } from "react-router";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { uploadFile } from "../../api/upload.api.ts";
import {inquiryDetail, updateInquiry } from "../../api/inquiry.api.ts";

function InquiryEdit() {
    const navigate = useNavigate();
    const {id} = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<InquiryType>("RESERVATION");
    const [attachImage, setAttachImage] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const loadData = async ()=> {
            try{
                const response = await inquiryDetail(String(id))
                const data = response.data;
                setTitle(data.title);
                setContent(data.content);
                setType(data.type as InquiryType);
                if (data.images && data.images.length > 0) {
                    const imageUrls = data.images.map((img) => img.url); //
                    setAttachImage(imageUrls);
                }
            }catch (e) {
                console.error(e);
            }
        }
        loadData().then(()=>{})
    },[id])

    const handelFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        const file = files[0];

        if (file.size > 5 * 1024 * 1024) {
            alert("이미지 크기는 5MB이하여야 합니다.");
        }

        try {
            const url = await uploadFile(file, "upload");
            setAttachImage([...attachImage, url]);
        } catch (error) {
            console.log(error);
            alert("이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (indexToRemove: number) => {
        setAttachImage(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!id) return;
        try {
            await updateInquiry(String(id),{ title, content, type, images: attachImage });
            alert("수정되었습니다.")
            navigate("/inquiry");
        } catch (error) {
            console.log(error);
            alert("수정 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className={"bg-gray-50 flex-1"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <h2 className={"font-bold text-xl"}>1:1 문의 수정</h2>
                <form
                    onSubmit={handleSubmit}
                    className={"flex flex-col gap-4 w-full relative bg-white  p-6 rounded-xl"}>
                    <div className={"w-full"}>
                        <Select
                            label={"문의 유형"}
                            className={"p-3 w-full"}
                            options={[
                                { value: "RESERVATION", label: "예약 문의" },
                                { value: "PRODUCT", label: "상품 문의" },
                                { value: "EXCHANGE_RETURN", label: "교환/환불 문의" },
                                { value: "MEMBER", label: "회원정보 문의" },
                                { value: "OTHER", label: "기타 문의" },
                            ]}
                            value={type}
                            onChange={e => setType(e.target.value as InquiryType)}
                        />
                    </div>
                    <Input
                        label={"문의 내용"}
                        placeholder={"제목을 입력해주세요."}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        value={content}
                        placeholder={"내용을 입력해주세요."}
                        className={twMerge(
                            ["border", "border-gray-300", "w-full", "min-h-[200px]", "rounded-xl"],
                            ["resize-none", "focus:outline-none", "focus:border-black", "p-3"],
                            ["placeholder:text-gray-400", "text-sm"],
                        )}
                        onChange={e => setContent(e.target.value)}
                    />
                    <div>
                        <div
                            className={twMerge(
                                ["flex", "flex-col", "justify-center", "items-center"],
                                ["w-20", "h-20","relative"],
                                ["border","border-gray-400", "rounded-xl"],
                                ["text-gray-400", "font-bold", "cursor-pointer", "bg-white"],
                            )}
                            onClick={() => {
                                if (attachImage.length >= 5) {
                                    alert("5장까지만 첨부 가능 합니다.");
                                    return;
                                }
                                fileInputRef.current?.click();
                            }}>
                            <GoPlus size={24} className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"} />
                            <span className={"text-sm absolute bottom-1.5 font-medium"}>{attachImage.length}/5</span>
                        </div>
                        <input
                            type={"file"}
                            accept={"image/*"}
                            className={"hidden"}
                            ref={fileInputRef}
                            onChange={handelFileChange}
                        />
                        <div className={"flex gap-1 mt-2"}>
                            {attachImage.map((url, index) => (
                                <div
                                    key={index}
                                    className={twMerge(
                                        ["w-20", "h-20", "relative"],
                                        ["border", "border-gray-200", "rounded-xl"],
                                        ["group", "bg-white"],
                                    )}>
                                    <img
                                        src={url}
                                        alt={url}
                                        className={"w-full h-full object-cover"}
                                    />
                                    <button
                                        type={"button"}
                                        className={
                                            "absolute top-1 right-1 rounded-full p-1 opacity-80 hover:opacity-100 bg-black text-white transition-all"
                                        }
                                        onClick={() => removeImage(index)}>
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <ul
                            className={twMerge(
                                ["p-4", "rounded-xl", "w-full", "space-y-1"],
                                ["[&>li]:text-sm", "[&>li]:text-gray-600", "[&>li]:font-medium"],
                            )}>
                            <li>• 이미지 파일만 업로드 가능합니다.</li>
                            <li>• 5MB 이하의 파일을 최대 5개까지 첨부할 수 있습니다.</li>
                        </ul>
                    </div>
                    <ul
                        className={twMerge(
                            ["bg-gray-100", "p-4", "rounded-xl", "w-full", "space-y-1"],
                            ["[&>li]:text-sm", "[&>li]:text-gray-600", "[&>li]:font-medium"],
                        )}>
                        <li>
                            • 1:1 문의는 24시간 등록할 수 있으며, 등록 시간을 기준으로 취소 및 환불
                            규정이 적용됩니다.
                        </li>
                        <li>• 1:1 문의 답변은 영업일 기준 평균 1일이 걸립니다.</li>
                        <li className={"!font-bold"}>
                            • 등록한 문의는 답변이 달리면 수정하거나 삭제할 수 없습니다.
                        </li>
                    </ul>
                    <div className={"flex gap-2 mt-10"}>
                        <Button type={"button"} variant={"secondary"} fullWidth={true} onClick={() => navigate(-1)}>
                            취소
                        </Button>
                        <Button type={"submit"} fullWidth={true}>{isSubmitting ? "수정 중" : "문의 수정"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default InquiryEdit