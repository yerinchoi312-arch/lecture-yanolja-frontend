import { create } from "zustand";

export type ModalType = "PAYMENT"|"REVIEW_FORM" | null;

interface ModalState {
    isOpen: boolean;
    modalType: ModalType;
    modalProps: any;
    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
    modalType: null,
    isOpen: false,
    modalProps: {},
    openModal: (type, props) => set({ modalType: type, isOpen: true, modalProps: props }),
    closeModal: () => set({ modalType: null, isOpen: false, modalProps: {} }),
}));
