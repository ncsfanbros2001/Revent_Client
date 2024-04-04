import { observer } from "mobx-react-lite";
import { Button, Header, Item, Segment, Image } from "semantic-ui-react";
import { Events } from "../../Interfaces/event";
import { useStore } from "../../Stores/store";
import EventForm from "../Form/EventForm";
import { format } from "date-fns";

const eventImageStyle = {
    filter: 'brightness(50%)'
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
    event: Events
}

const EventDetailHeader = ({ event }: Props) => {
    const { modalStore, eventStore } = useStore();
    const { openModal } = modalStore
    const { selectedEvent } = eventStore

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src='../../../public/travel.jpg' fluid style={eventImageStyle} />
                <Segment style={eventImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size='huge' content={event.title} style={{ color: 'white' }} />
                                <p>{format(event.beginTime!, 'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by <strong>Inscifer</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal'>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button color='orange' floated='right' onClick={() => openModal(<EventForm selectedEvent={selectedEvent} />)}>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    )
}

export default observer(EventDetailHeader)