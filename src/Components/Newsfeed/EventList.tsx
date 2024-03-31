import { Button, Item, Label, Segment } from "semantic-ui-react"
import { Events } from "../../Interfaces/event"
import { SyntheticEvent, useState } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"

const EventList = () => {
    const [target, setTarget] = useState<string>("");

    const { eventStore } = useStore();
    const { eventsByDate, deleteEvent, loading } = eventStore


    const handleDeleting = (event: SyntheticEvent<HTMLButtonElement>, eventId: string) => {
        setTarget(event.currentTarget.name)
        deleteEvent(eventId)
    }
    return (
        <Segment>
            <Item.Group divided>
                {eventsByDate.map((event: Events) => (
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
                                    name={event.eventID}
                                    floated="right"
                                    content='Delete'
                                    color="red"
                                    loading={loading && target === event.eventID}
                                    onClick={(e) => handleDeleting(e, event.eventID)} />

                                <Button
                                    as={Link}
                                    to={`/details/${event.eventID}`}
                                    floated="right"
                                    content='View'
                                    color="blue" />

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

export default observer(EventList)