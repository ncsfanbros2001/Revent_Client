import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import { useEffect } from "react";
import EventList from "../Components/Newsfeed/EventList";
import { useStore } from "../Stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../Components/Common/LoadingComponent";

const Newsfeed = () => {
    const { eventStore } = useStore()
    const { loadAllEvents, loadingInitial, setSelectedEvent, selectedEvent } = eventStore

    useEffect(() => {
        if (selectedEvent) {
            setSelectedEvent(undefined)
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
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    );
};

export default observer(Newsfeed);
