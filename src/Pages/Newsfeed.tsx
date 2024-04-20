import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import { useEffect } from "react";
import EventList from "../Components/Newsfeed/EventList";
import { useStore } from "../Stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../Components/Common/LoadingComponent";
import EventFilter from "../Components/Newsfeed/EventFilter";

const Newsfeed = () => {
    const { eventStore } = useStore()
    const { loadAllEvents, loadingInitial, clearSelectedEvent, selectedEvent } = eventStore

    useEffect(() => {
        if (selectedEvent) {
            clearSelectedEvent
        }
        loadAllEvents()
    }, [eventStore]);


    if (loadingInitial) {
        return <LoadingComponent content="Loading App" />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <EventList />
            </Grid.Column>

            <Grid.Column width={6}>
                <EventFilter />
            </Grid.Column>
        </Grid>
    );
};

export default observer(Newsfeed);
