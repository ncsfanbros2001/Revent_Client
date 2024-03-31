import { Button, Form, Segment } from "semantic-ui-react"
import { ChangeEvent, useEffect, useState } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { Events } from "../../Interfaces/event"
import LoadingComponent from "../Common/LoadingComponent"

interface Props {
    selectedEvent?: Events
}

const EventForm = (props: Props) => {
    const { eventStore, modalStore } = useStore()
    const { closeModal } = modalStore
    const { createEvent, updateEvent, loading, loadOneEvent, loadingInitial } = eventStore
    const { selectedEvent } = props

    const [eventInfo, setEventInfo] = useState<Events>({
        eventID: '',
        title: '',
        wallpaper: '',
        location: '',
        beginTime: '',
        endTime: '',
        category: '',
        status: '',
        description: '',
        publicity: '',
        attendDeadline: '',
        createdTime: '',
        updatedAt: '',
    })

    useEffect(() => {
        if (selectedEvent) {
            setEventInfo(selectedEvent)
        }
    }, [selectedEvent, loadOneEvent])

    const handleSubmit = () => {
        selectedEvent ? updateEvent(eventInfo) : createEvent(eventInfo);
        closeModal()
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setEventInfo({
            ...eventInfo,
            [name]: value // Specify whatever field has this name should equal to the value inside that input
        })
    }

    if (loadingInitial) return <LoadingComponent content="Loading Actiity..." />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input
                    placeholder="Title"
                    value={eventInfo.title}
                    name='title'
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Wallpaper"
                    value={eventInfo.wallpaper}
                    name='wallpaper'
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Location"
                    value={eventInfo.location}
                    name='location'
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Begin Time"
                    value={eventInfo.beginTime}
                    name='beginTime'
                    type="date"
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="End Time"
                    value={eventInfo.endTime}
                    name='endTime'
                    type="date"
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Category"
                    value={eventInfo.category}
                    name='category'
                    onChange={handleInputChange} />

                <Form.TextArea
                    placeholder="Description"
                    value={eventInfo.description}
                    name='description'
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Publictiy"
                    value={eventInfo.publicity}
                    name='publicity'
                    onChange={handleInputChange} />

                <Form.Input
                    placeholder="Attend Deadline"
                    value={eventInfo.attendDeadline}
                    name='attendDeadline'
                    type="date"
                    onChange={handleInputChange} />

                <Button loading={loading} floated="right" positive type="submit" content='Submit' />
                <Button floated="right" type="button" content='Cancel' onClick={() => closeModal()} />
            </Form>
        </Segment>
    )
}

export default observer(EventForm)