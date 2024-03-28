import { Container } from "semantic-ui-react";
import Newsfeed from "./Pages/Newsfeed";
import "./Stylesheets/global.css";
import Navbar from "./Components/Common/Navbar";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Events } from "./Interfaces/event";

const App = () => {
    const [events, setEvents] = useState<Events[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Events | undefined>(undefined)
    const [editMode, setEditMode] = useState<boolean>(false)

    useEffect(() => {
        axios.get<Events[]>("http://localhost:5000/api/event") // return a promise of type AxiosResponse
            .then((response) => {
                setEvents(response.data);
            });
    }, []);

    const handleSelectEvent = (eventId: string) => {
        setSelectedEvent(events.find(x => x.eventID === eventId))
    }

    const handleCancelSelectedEvent = () => {
        setSelectedEvent(undefined)
    }

    const handleFormOpen = (eventId?: string) => {
        eventId ? handleSelectEvent(eventId) : handleCancelSelectedEvent()
        setEditMode(true)
    }

    const handleFormClose = () => {
        setEditMode(false)
    }

    return (
        <Fragment>
            <Navbar handleFormOpen={handleFormOpen} />
            <Container style={{ marginTop: "6em" }}>
                <Newsfeed events={events}
                    selectedEvent={selectedEvent}
                    handleSelectEvent={handleSelectEvent}
                    handleCancelSelectedEvent={handleCancelSelectedEvent}
                    handleFormOpen={handleFormOpen}
                    handleFormClose={handleFormClose}
                    editMode={editMode} />
            </Container>
        </Fragment>
    );
};

export default App;
