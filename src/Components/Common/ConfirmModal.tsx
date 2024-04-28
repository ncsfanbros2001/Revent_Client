import { Button, Header, Modal } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"


const ConfirmModal = () => {
    const { modalStore } = useStore()
    return (
        <Modal open={modalStore.confirmModal.isOpen} size="tiny">
            <Modal.Content>
                <Header as='h2' content={modalStore.confirmModal.content} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' icon='x' content="No" onClick={() => modalStore.closeConfirmation()} />
                <Button color='green' icon='check' content="Yes"
                    onClick={modalStore.confirmModal.method!} />
            </Modal.Actions>
        </Modal >
    )
}

export default observer(ConfirmModal)