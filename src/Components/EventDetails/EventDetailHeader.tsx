import { observer } from "mobx-react-lite";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { EventsModel } from "../../Interfaces/event";
import { useStore } from "../../Stores/store";
import EventForm from "../Form/EventForm";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { EventStatus } from "../../Utilities/staticValues";
import { Fragment } from "react/jsx-runtime";
import { Care } from "../../Interfaces/care";

const eventImageStyle = {
    filter: 'brightness(80%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    event: EventsModel
}

const EventDetailHeader = ({ event }: Props) => {
    const { modalStore, eventStore, userStore } = useStore();
    const { updateAttendance, loading, cancelEvent } = eventStore

    const handleCancelEvent = () => {
        cancelEvent().then(modalStore.closeConfirmation)
    }

    const handleCare = () => {
        if (event.isCaring === false) {
            event.careCount++
            event.cares.push(new Care(userStore.currentUser!))
            event.isCaring = true
        }
        else {
            event.careCount--
            event.cares.filter(x => x.userID !== userStore.currentUser!.userID)
            event.isCaring = false
        }
        eventStore.careToEvent(event.eventID)
    }

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {
                    event.status === EventStatus.Cancelled && <Label
                        style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }} ribbon color="red" content="Cancelled" />
                }
                <Image src='/public/travel.jpg' fluid style={eventImageStyle} />
                <Segment style={eventImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size='huge' content={event.title} style={{ color: 'white' }} />
                                <p>{format(event.beginTime!, 'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${event.host?.userID}`}>{event.host?.fullname}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button as='div' labelPosition='right' disabled={event.status === EventStatus.Cancelled || event.isHost}>
                    <Button
                        color={event.isCaring ? 'blue' : 'teal'}
                        icon={event.isCaring ? 'star' : 'star outline'}
                        content='Care'
                        onClick={() => handleCare()} />
                    <Label basic color='blue' pointing='left'>
                        {event.careCount}
                    </Label>
                </Button>

                {
                    event.isHost ? (
                        <Fragment>
                            <Button
                                color='red'
                                floated='right'
                                basic={event.status === EventStatus.Cancelled}
                                disabled={event.status === EventStatus.Cancelled || event.beginTime! < new Date()}
                                onClick={() => {
                                    modalStore.triggerConfirmation(
                                        "Are you sure you want to cancel this event ?", handleCancelEvent)
                                }}
                                loading={loading}>
                                {event.status === EventStatus.Cancelled ? 'Event Cancelled' : 'Cancel Event'}
                            </Button>
                            <Button
                                color='orange'
                                floated='right'
                                disabled={event.status === EventStatus.Cancelled || event.beginTime! < new Date()}
                                onClick={() => modalStore.openModal(<EventForm selectedEvent={event} />)}>
                                Manage Event
                            </Button>
                        </Fragment>

                    ) : event.isGoing ? (
                        <Button
                            loading={loading}
                            disabled={event.status === EventStatus.Cancelled || event.attendDeadline! < new Date()}
                            onClick={() => updateAttendance()}>
                            Cancel attendance
                        </Button>
                    ) : (
                        <Button
                            loading={loading}
                            disabled={event.status === EventStatus.Cancelled || event.attendDeadline! < new Date()}
                            color='teal'
                            onClick={() => updateAttendance()}>
                            Join Event
                        </Button>
                    )
                }
            </Segment>
        </Segment.Group>
    )
}

export default observer(EventDetailHeader)