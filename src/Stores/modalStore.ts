import { makeAutoObservable } from "mobx"

interface Modal {
    open: boolean;
    body: JSX.Element | null,
    showClose: boolean;
}

interface ConfirmBoxModal {
    isOpen: boolean;
    content: string | null
    method: any;
}


export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null,
        showClose: false
    }

    confirmModal: ConfirmBoxModal = {
        isOpen: false,
        content: null,
        method: null
    }

    constructor() {
        makeAutoObservable(this)
    }

    openModal = (content: JSX.Element, showClose: boolean = false) => {
        this.modal.open = true
        this.modal.body = content
        this.modal.showClose = showClose
    }

    closeModal = () => {
        this.modal.open = false
        this.modal.body = null
        this.modal.showClose = false
    }

    triggerConfirmation = (content: string, method: () => void) => {
        this.confirmModal.isOpen = true
        this.confirmModal.content = content
        this.confirmModal.method = method
    }

    closeConfirmation = () => {
        this.confirmModal.isOpen = false
        this.confirmModal.content = null
        this.confirmModal.method = null
    }
}