import PaymentModal from "./PaymentModal.tsx";
import { useModalStore } from "../../store/useModalStore.ts";

const MODAL_COMPONENT={
    PAYMENT:PaymentModal,
}

function GlobalModal(){
    const{modalType,isOpen}=useModalStore();

    if(!isOpen || !modalType)return null;

    const SpecificModal=MODAL_COMPONENT[modalType];


    return<SpecificModal/>
}
export default GlobalModal;