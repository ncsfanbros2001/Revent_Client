import { Button, Icon, Item, Segment } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { useStore } from "../../Stores/store"
import { Link } from "react-router-dom"
import { format } from "date-fns"

interface Props {
    event: EventsModel
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
                <Icon name="clock" /> {format(event.beginTime!, 'dd MMM yyyy h:mm aa')}
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