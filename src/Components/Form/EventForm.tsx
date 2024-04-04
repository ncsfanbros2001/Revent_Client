import { Button, Segment } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { Events } from "../../Interfaces/event"
import LoadingComponent from "../Common/LoadingComponent"
import { Formik, Form } from "formik"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import SelectInput from "../FormikControls/SelectInput"
import { eventCategoryOptions } from "../../Utilities/eventCategoryOptions"
import DateInput from "../FormikControls/DateInput"
import TextAreaInput from "../FormikControls/TextAreaInput"

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
        beginTime: null,
        endTime: null,
        category: '',
        status: '',
        description: '',
        publicity: '',
        attendDeadline: null,
        createdTime: null,
        updatedAt: null,
    })

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        wallpaper: Yup.string().required('Wallpaper is required'),
        location: Yup.string().required('Location is required'),
        beginTime: Yup.string().required('Begin Time is required'),
        endTime: Yup.string().required('End Time is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        publicity: Yup.string().required('Publicity is required'),
        attendDeadline: Yup.string().required('AttendDeadline is required')
    })

    useEffect(() => {
        if (selectedEvent) {
            setEventInfo(selectedEvent)
        }
    }, [selectedEvent, loadOneEvent])

    const handleFormSubmit = (event: Events) => {
        selectedEvent ? updateEvent(event) : createEvent(event);
        closeModal()
    }

    if (loadingInitial) return <LoadingComponent content="Loading Actiity..." />

    return (
        <Segment clearing>
            <Formik
                enableReinitialize
                initialValues={eventInfo}
                onSubmit={values => handleFormSubmit(values)}
                validationSchema={validationSchema}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <TextInput
                                name='title'
                                placeholder='Title' />

                            <TextInput
                                name='wallpaper'
                                placeholder='Wallpaper' />

                            <TextInput
                                name='location'
                                placeholder='Location' />

                            <DateInput
                                name='beginTime'
                                placeholderText='Begin Time'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />

                            <DateInput
                                name='endTime'
                                placeholderText='End Time'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />

                            <SelectInput
                                name='category'
                                placeholder='Category'
                                options={eventCategoryOptions} />

                            <TextAreaInput
                                name='description'
                                placeholder='Description'
                                rows={5} />

                            <TextInput
                                name='publicity'
                                placeholder='Publictiy' />

                            <DateInput
                                name='attendDeadline'
                                placeholderText='Attend Deadline'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />



                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading}
                                floated="right"
                                positive type="submit"
                                content='Submit' />
                            <Button
                                floated="right"
                                type="button"
                                content='Cancel'
                                onClick={() => closeModal()} />
                        </Form>
                    )
                }
            </Formik>
        </Segment>
    )
}

export default observer(EventForm)