import { Button, Icon, Item, Label, Segment, Image, Header } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import EventGuestList from "./EventGuestList"
import { observer } from "mobx-react-lite"
import { EventStatus, Roles } from "../../Utilities/staticValues"
import { useStore } from "../../Stores/store"
import ReportForm from "../Common/ReportForm"

interface Props {
    event: EventsModel
}

const EventListItem = ({ event }: Props) => {
    const { eventStore, userStore, modalStore } = useStore()

    return (
        <Segment.Group style={{ margin: '20px 0px' }}>
            <Segment>
                {
                    event.status === EventStatus.Cancelled ? (
                        <Label attached="top" color="red" content="Cancelled" style={{ textAlign: 'center' }} />
                    ) : (
                        event.attendDeadline! < new Date() && event.beginTime! > new Date() ? (
                            <Label attached="top" color="green" content="About to Begin" style={{ textAlign: 'center' }} />
                        ) : event.beginTime! < new Date() && event.endTime! > new Date() ? (
                            <Label attached="top" color="blue" content="Occuring" style={{ textAlign: 'center' }} />
                        ) : event.endTime! < new Date() ? (
                            <Label attached="top" color="orange" content="Finished" style={{ textAlign: 'center' }} />
                        ) : null
                    )
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
                <Icon name="marker" /> {event.location}
                <br />
                <Icon name="clock" /> {format(event.beginTime!, 'dd MMM yyyy h:mm aa')} - {format(event.endTime!, 'dd MMM yyyy h:mm aa')}
                {event.createdTime !== event.updatedAt && (
                    <>
                        <br />
                        <b style={{ color: 'red' }}>(This event's last update was at {format(event.updatedAt!, 'dd MMM yyyy h:mm aa')})</b>
                    </>
                )}
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
                    <Label basic color={event.isCaring ? 'blue' : 'teal'} pointing='left'>
                        {event.careCount}
                    </Label>
                </Button>

                {
                    !event.isHost && userStore.currentUser?.role !== Roles.Admin &&
                    (<Button
                        disabled={event.status === EventStatus.Cancelled}
                        color="red"
                        content='Report'
                        floated="right"
                        icon='bullhorn'
                        onClick={() => modalStore.openModal(<ReportForm event={event} />)} />)
                }
                <Button as={Link} to={`/details/${event.eventID}`} color="green" floated="right" content="View" icon='eye' />
            </Segment>

        </Segment.Group>
    )
}

export default observer(EventListItem)