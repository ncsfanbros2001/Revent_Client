import { Button, Dimmer, Grid, Header, Icon } from 'semantic-ui-react'
import { useStore } from '../Stores/store';
import LoadingComponent from '../Components/Common/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EventDetailHeader from '../Components/EventDetails/EventDetailHeader';
import EventDetailInfo from '../Components/EventDetails/EventDetailInfo';
import EventDetailComment from '../Components/EventDetails/EventDetailComment';
import EventDetailGuestList from '../Components/EventDetails/EventDetailGuestList';
import { EventStatus, Roles } from '../Utilities/staticValues';
import { router } from '../router/Routes';


const EventDetails = () => {
    const { eventStore, userStore } = useStore();
    const { selectedEvent, loadOneEvent, loadingInitial } = eventStore
    const { eventID } = useParams()

    useEffect(() => {
        if (eventID) {
            loadOneEvent(eventID)
        }
    }, [eventID])

    if (!selectedEvent || loadingInitial) return <LoadingComponent content='Loading Event...' /> // Not gonna happen 
    if (selectedEvent.status === EventStatus.Suspended && userStore.currentUser?.role !== Roles.Admin)
        return (
            <Dimmer active={true} inverted={false}>
                <Header as='h2' icon inverted>
                    <Icon name='expeditedssl' />
                    Sorry but this event is currently being suspended!
                    <br />
                    <Button
                        content='Return To Newsfeed'
                        color='green'
                        style={{ marginTop: 20 }}
                        onClick={() => router.navigate('/')} />
                </Header>
            </Dimmer>
        )
    return (
        <Grid>
            <Grid.Column width={10}>
                <EventDetailHeader event={selectedEvent} />
                <EventDetailInfo event={selectedEvent} />
                <EventDetailComment eventID={eventID!} />
            </Grid.Column>

            <Grid.Column width={6}>
                <EventDetailGuestList event={selectedEvent} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(EventDetails)