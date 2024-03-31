import { Button, Card } from 'semantic-ui-react'
import { useStore } from '../Stores/store';
import LoadingComponent from '../Components/Common/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EventForm from '../Components/Form/EventForm';

const EventDetails = () => {
    const { eventStore, modalStore } = useStore();
    const { selectedEvent, loadOneEvent, loadingInitial } = eventStore
    const { openModal } = modalStore
    const navigate = useNavigate()

    const { eventID } = useParams()

    useEffect(() => {
        if (eventID) {
            loadOneEvent(eventID)
        }
    }, [eventID, loadOneEvent])

    if (!selectedEvent || loadingInitial) return <LoadingComponent /> // Not gonna happen 

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{selectedEvent.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedEvent.beginTime}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedEvent.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' content='Edit'
                        onClick={() => openModal(<EventForm selectedEvent={selectedEvent} />)} />
                    <Button basic color='grey' content='Cancel' onClick={() => navigate(-1)} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(EventDetails)