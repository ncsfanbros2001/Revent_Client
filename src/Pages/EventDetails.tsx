import { Grid } from 'semantic-ui-react'
import { useStore } from '../Stores/store';
import LoadingComponent from '../Components/Common/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EventDetailHeader from '../Components/EventDetails/EventDetailHeader';
import EventDetailInfo from '../Components/EventDetails/EventDetailInfo';
import EventDetailComment from '../Components/EventDetails/EventDetailComment';
import EventDetailGuestList from '../Components/EventDetails/EventDetailGuestList';


const EventDetails = () => {
    const { eventStore } = useStore();
    const { selectedEvent, loadOneEvent, loadingInitial, clearSelectedEvent } = eventStore
    const { eventID } = useParams()

    useEffect(() => {
        if (eventID) {
            loadOneEvent(eventID)
        }

        return () => clearSelectedEvent()
    }, [eventID, loadOneEvent, clearSelectedEvent])

    if (!selectedEvent || loadingInitial) return <LoadingComponent content='Loading Event...' /> // Not gonna happen 

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