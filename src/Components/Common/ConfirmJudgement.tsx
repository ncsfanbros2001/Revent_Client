import { Button, Header, Segment } from "semantic-ui-react"
import { useStore } from "../../Stores/store"

interface Props {
    isGuilty: boolean
    reportID: string
}

const ConfirmJudgement = ({ isGuilty, reportID }: Props) => {
    const { modalStore, reportStore } = useStore()

    const handleJudgement = () => {
        reportStore.passJudgement(isGuilty, reportID).then(() => modalStore.closeModal())
    }

    return (
        <Segment clearing>
            <Header as='h1' content='Are you sure about this ?' />
            <Button color="green" content="Yes" floated="right" onClick={() => handleJudgement()} />
            <Button color="red" content="No" floated="right" onClick={() => modalStore.closeModal()} />
        </Segment>
    )
}

export default ConfirmJudgement