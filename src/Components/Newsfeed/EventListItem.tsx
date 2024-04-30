import { Button, Icon, Item, Label, Segment, Image, Header } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import EventGuestList from "./EventGuestList"
import { observer } from "mobx-react-lite"
import { EventStatus } from "../../Utilities/staticValues"
import { useStore } from "../../Stores/store"

interface Props {
    event: EventsModel
}

const EventListItem = ({ event }: Props) => {
    const { eventStore } = useStore()

    return (
        <Segment.Group style={{ margin: '20px 0px' }}>
            <Segment>
                {
                    event.status === EventStatus.Cancelled &&
                    <Label attached="top" color="red" content="Cancelled" style={{ textAlign: 'center' }} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image
                            size="tiny"
                            style={{ marginBottom: 5 }}
                            circular
                            src={event.host?.avatarURL || '/public/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/details/${event.eventID}`}>{event.title}</Item.Header>
                            <Item.Description>
                                Hosted by <Link to={`/profiles/${event.host?.userID}`}>{event.host?.fullname}</Link>
                            </Item.Description>
                            {
                                event.isHost && (
                                    <Item.Description>
                                        <Label basic color="orange">Hosting</Label>
                                    </Item.Description>
                                )
                            }
                            {
                                event.isGoing && !event.isHost && (
                                    <Item.Description>
                                        <Label basic color="green">Attending</Label>
                                    </Item.Description>
                                )
                            }
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
                <Header as='h5' content="Guest List:" color="teal" />
                <EventGuestList guests={event.guests} />
            </Segment>

            <Image src={'/public/travel.jpg'} />

            <Segment clearing>
                <Button as='div' labelPosition='right' disabled={event.status === EventStatus.Cancelled || event.isHost}>
                    <Button
                        color={event.isCaring ? 'blue' : 'teal'}
                        icon={event.isCaring ? 'star' : 'star outline'}
                        content='Care'
                        onClick={() => eventStore.careToEvent(event.eventID)} />
                    <Label basic color='blue' pointing='left'>
                        {event.careCount}
                    </Label>
                </Button>

                <Button as={Link} to={`/details/${event.eventID}`} color="teal" floated="right" content="View" />
            </Segment>

        </Segment.Group>
    )
}

export default observer(EventListItem)