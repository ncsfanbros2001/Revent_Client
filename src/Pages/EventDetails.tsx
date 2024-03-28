import { Button, Card } from 'semantic-ui-react'
import { Events } from '../Interfaces/event'

interface Props {
    selectedEvent: Events
    handleCancelSelectedEvent: () => void
    handleFormOpen: (eventId?: string) => void
    handleFormClose: () => void
}

const EventDetails = (props: Props) => {
    const { selectedEvent, handleCancelSelectedEvent, handleFormOpen, handleFormClose } = props

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{selectedEvent.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedEvent.beginTime}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedEvent.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' content='Edit' onClick={() => handleFormOpen(selectedEvent.eventID)} />
                    <Button basic color='grey' content='Cancel' onClick={() => {
                        handleFormClose()
                        handleCancelSelectedEvent()
                    }} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default EventDetails