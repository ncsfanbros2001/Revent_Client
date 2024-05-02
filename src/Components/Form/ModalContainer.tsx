import { observer } from "mobx-react-lite"
import { Button, Modal } from "semantic-ui-react"
import { useStore } from "../../Stores/store"

const ModalContainer = () => {
    const { modalStore } = useStore()

    return (
        <Modal open={modalStore.modal.open} onClose={() => modalStore.closeModal} size="large">
            <Button icon='x' color="red" onClick={() => modalStore.closeModal()} />
            {modalStore.modal.body}
        </Modal>
    )
}

export default observer(ModalContainer)