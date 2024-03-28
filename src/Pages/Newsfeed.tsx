import "semantic-ui-css/semantic.min.css";
import { Events } from "../Interfaces/event";
import { Grid } from "semantic-ui-react";
import { Fragment } from "react";
import EventList from "../Components/Newsfeed/EventList";
import EventForm from "../Components/Form/EventForm";
import EventDetails from "./EventDetails";

interface Props {
    events: Events[],
    selectedEvent: Events | undefined
    handleSelectEvent: (eventId: string) => void
    handleCancelSelectedEvent: () => void
    handleFormOpen: (eventId?: string) => void
    handleFormClose: () => void
    editMode: boolean
}

const Newsfeed = (props: Props) => {
    const { events, selectedEvent, handleSelectEvent, handleCancelSelectedEvent, handleFormClose, handleFormOpen,
        editMode } = props

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={10}>
                    <EventList
                        events={events}
                        handleSelectEvent={handleSelectEvent}
                    />
                </Grid.Column>

                <Grid.Column width={6}>
                    {selectedEvent && <EventDetails
                        selectedEvent={selectedEvent}
                        handleCancelSelectedEvent={handleCancelSelectedEvent}
                        handleFormOpen={handleFormOpen}
                        handleFormClose={handleFormClose} />}
                    {editMode === true && <EventForm handleFormClose={handleFormClose} />}
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

export default Newsfeed;
