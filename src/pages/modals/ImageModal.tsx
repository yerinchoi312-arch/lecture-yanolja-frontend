import { useModalStore } from "../../store/useModalStore.ts";
import Modal from "../components/Modal.tsx";

function ImageModal() {
    const {closeModal,modalProps,isOpen} = useModalStore()
    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}>
            <div>
                <img src={modalProps.imgUrl} alt={modalProps.alt}/>
            </div>

        </Modal>
    );
}
export default ImageModal;