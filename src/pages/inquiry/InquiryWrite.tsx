import { twMerge } from "tailwind-merge";
import Input from "../components/Input.tsx";
import { useForm } from "react-hook-form";
import Button from "../components/Button.tsx";
import { CreateInquiries } from "../../api/inquiry.api.ts";
import { useNavigate } from "react-router";
import Select from "../components/Select.tsx";

type InquiryCreateFormData = {
    title: string;
    content: string;
    status: string;
};

function InquiryWrite() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InquiryCreateFormData>();

    const onSubmit = async (formData: InquiryCreateFormData) => {
        try {
            await CreateInquiries(formData.title, formData.content, formData.status);
            navigate("/inquiry");
        } catch (error) {
            console.log(error);
            alert("등록 실패했습니다.");
        }
    };
    return (
        <div className={"bg-gray-50 flex-1"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10", "gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={"flex flex-col items-end gap-4 relative bg-white p-6"}>
                    <div className={"flex w-full items-center gap-2"}>
                        <h2>문의 유형</h2>
                        <Select
                            className={"p-3 pr-3"}
                            options={[
                                { value: "RESERVATION", label: "예약" },
                                { value: "PRODUCT", label: "상품" },
                                { value: "EXCHANGE_RETURN", label: "교환/환불" },
                                { value: "MEMBER", label: "회원정보" },
                                { value: "OTHER", label: "기타" },
                            ]}
                            registration={register("status")}></Select>
                    </div>
                    <Input
                        registration={register("title", { required: "제목은 필수입니다." })}
                        placeholder={"제목을 입력해주세요."}
                    />
                    <textarea
                        {...register("content", {
                            required: "내용은 필수 입니다",
                            minLength: {
                                value: 5,
                                message: "최소 5자 이상 입력해주세요.",
                            },
                        })}
                        placeholder={"내용을 입력해주세요"}
                        className={twMerge(
                            ["border", "border-gray-300", "w-full", "min-h-[200px]", "rounded-xl"],
                            ["resize-none", "focus:outline-none", "focus:border-black", "p-3"],
                        )}
                    />
                    {errors.content && (
                        <span className={"text-xs text-red-500"}>{errors.content.message}</span>
                    )}
                    <Button>문의 등록</Button>
                </form>
            </div>
        </div>
    );
}
export default InquiryWrite;
