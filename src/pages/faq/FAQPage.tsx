import { twMerge } from "tailwind-merge";
import Accordion from "../components/Accordion.tsx";
import BackButton from "../components/BackButton.tsx";

function FAQPage() {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "py-10"],
                ["max-w-[800px]", "mx-auto", "w-full"],
            )}>
            <div className={"space-y-20 relative"}>
                <BackButton className={"absolute top-2 md:hidden"} />
                <h2 className={twMerge(["text-2xl", "font-bold", "text-center"])}>FAQ</h2>
                <div>
                    <p className={twMerge(["text-lg", "font-semibold", "mb-4"])}>
                        자주 묻는 질문 Best 5
                    </p>
                    <div
                        className={twMerge(
                            ["divide-y-1", "divide-gray-200"],
                            ["border-2", "border-gray-100"],
                        )}>
                        <Accordion
                            title={"숙소 이용내역 증빙자료(예약내역서)는 어떻게 받나요?"}
                            children={
                                "숙소 이용내역은 아래 경로를 통해 확인할 수 있으며,\n" +
                                "이미지 저장 및 이메일 전송도 가능합니다."
                            }
                        />
                        <Accordion
                            title={"질병/사고로 인한 취소는 어떻게 하나요?"}
                            children={
                                "법정 감염병, 질병, 사고 등으로 인해 숙소 이용이 어려우시다면, NOL 카카오톡 채팅 상담을 통해 문의해 주세요."
                            }
                        />
                        <Accordion
                            title={"예약한 상품을 취소하고 싶어요."}
                            children={
                                "예약하신 상품은 아래의 경로를 통해 취소 요청하실 수 있습니다."
                            }
                        />
                        <Accordion
                            title={"취소/환불 규정이 어떻게 되나요?"}
                            children={
                                "[취소 규정]\n" + " - 각 제휴점 별로 취소 수수료 규정이 다릅니다. "
                            }
                        />
                        <Accordion
                            title={"미성년자도 예약할 수 있나요?"}
                            children={
                                "만 19세 미만의 청소년의 경우 청소년 보호법에 의거하여 혼숙이 불가하며, 이용에 제한이 있을 수 있습니다."
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FAQPage;
