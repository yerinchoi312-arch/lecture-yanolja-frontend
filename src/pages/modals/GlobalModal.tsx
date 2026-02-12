import PaymentModal from "./PaymentModal.tsx";
import ReviewModal from "./ReviewModal.tsx";
import { useModalStore } from "../../store/useModalStore.ts";

const MODAL_COMPONENT={
    PAYMENT:PaymentModal,
    REVIEW_FORM:ReviewModal
}

function GlobalModal(){
    const{modalType,isOpen}=useModalStore();

    if(!isOpen || !modalType)return null;

    const SpecificModal=MODAL_COMPONENT[modalType];


    return<SpecificModal/>
}
export default GlobalModal;