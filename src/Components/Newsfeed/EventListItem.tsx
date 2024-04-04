import { Button, Icon, Item, Segment } from "semantic-ui-react"
import { Events } from "../../Interfaces/event"
import { useStore } from "../../Stores/store"
import { Link } from "react-router-dom"

interface Props {
    event: Events
}

const EventListItem = ({ event }: Props) => {
    const { eventStore } = useStore();
    const { deleteEvent, loading } = eventStore

    const handleDeleteEvent = (eventId: string) => {
        deleteEvent(eventId)
    }

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src='../../../public/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/details/${event.eventID}`}>{event.title}</Item.Header>
                            <Item.Description>Hosted by Inscifer</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>

            <Segment>
                <Icon name="clock" /> {event.beginTime}
                <br />
                <Icon name="marker" /> {event.location}
            </Segment>

            <Segment secondary>
                Guest List Goes Here
            </Segment>

            <Segment clearing>
                <span>{event.description}</span>
                <Button as={Link} to={`/details/${event.eventID}`} color="teal" floated="right" content="View" />
                <Button loading={loading} onClick={() => handleDeleteEvent(event.eventID)} color="red" floated="right" content="Delete" />
            </Segment>
        </Segment.Group>
    )
}

export default EventListItem