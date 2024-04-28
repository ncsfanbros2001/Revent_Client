import { Button, Header, Icon, Segment } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"

interface Props {
    message: string
}

const SuccessModal = (props: Props) => {
    const { modalStore } = useStore()
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name="check circle" color="green" size="huge" />
                <h1>{props.message}</h1>
                <p>Please check your email to get the password</p>
            </Header>

            <Segment.Inline>
                <Button onClick={() => modalStore.closeModal()} content='Close' primary />
            </Segment.Inline>
        </Segment>
    )
}

export default observer(SuccessModal)   