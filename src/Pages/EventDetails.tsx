import { Grid } from 'semantic-ui-react'
import { useStore } from '../Stores/store';
import LoadingComponent from '../Components/Common/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EventDetailHeader from '../Components/Details/EventDetailHeader';
import EventDetailInfo from '../Components/Details/EventDetailInfo';
import EventDetailComment from '../Components/Details/EventDetailComment';
import EventDetailGuestList from '../Components/Details/EventDetailGuestList';


const EventDetails = () => {
    const { eventStore } = useStore();
    const { selectedEvent, loadOneEvent, loadingInitial, clearSelectedActivity } = eventStore
    const { eventID } = useParams()

    useEffect(() => {
        if (eventID) {
            loadOneEvent(eventID)
        }

        return () => clearSelectedActivity()
    }, [eventID, loadOneEvent, clearSelectedActivity])

    if (!selectedEvent || loadingInitial) return <LoadingComponent /> // Not gonna happen 

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