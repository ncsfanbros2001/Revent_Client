import { Button, Item, Label, Segment } from "semantic-ui-react"
import { Events } from "../../Interfaces/event"

interface Props {
    events: Events[]
    handleSelectEvent: (eventId: string) => void
}

const EventList = (props: Props) => {
    const { events, handleSelectEvent } = props

    return (
        <Segment>
            <Item.Group divided>
                {events.map((event: Events) => (
                    <Item key={event.eventID}>
                        <Item.Content>
                            <Item.Header as='a'>{event.title}</Item.Header>
                            <Item.Meta>{event.beginTime}</Item.Meta>

                            <Item.Description>
                                <div>{event.description}</div>
                                <div>{event.location}</div>
                            </Item.Description>

                            <Item.Extra>
                                <Button
                                    floated="right"
                                    content='View'
                                    color="blue"
                                    onClick={() => handleSelectEvent(event.eventID)} />

                                <Label
                                    basic
                                    content={event.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}

export default EventList