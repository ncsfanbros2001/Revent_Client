import { Button, Header, Segment } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { EventFormValues, EventsModel } from "../../Interfaces/event"
import { Formik, Form } from "formik"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import SelectInput from "../FormikControls/SelectInput"
import { eventCategoryOptions, publicityOptions } from "../../Utilities/dropdownOptions"
import DateInput from "../FormikControls/DateInput"
import TextAreaInput from "../FormikControls/TextAreaInput"
import { router } from "../../router/Routes"
import EventRules from "../Common/EventRules"

interface Props {
    selectedEvent?: EventsModel
}

const EventForm = (props: Props) => {
    const { eventStore, modalStore } = useStore()
    const { createEvent, updateEvent, loadingInitial } = eventStore
    const { selectedEvent } = props

    const [eventInfo, setEventInfo] = useState<EventFormValues>(new EventFormValues())

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        wallpaper: Yup.string().required('Wallpaper is required'),
        location: Yup.string().required('Location is required'),
        beginTime: Yup.date()
            .required('Begin Time is required')
            .min(Yup.ref('attendDeadline'), 'Begin time must be greater than attend deadline'),
        endTime: Yup.date()
            .required('End Time is required')
            .min(Yup.ref('beginTime'), 'End time must be greater than begin time'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        publicity: Yup.string().required('Publicity is required'),
        attendDeadline: Yup.date()
            .required('Attend Deadline is required')
            .min(new Date(), "Attend Deadline must be in the future")
    })

    useEffect(() => {
        if (selectedEvent) {
            setEventInfo(new EventFormValues(selectedEvent))
        }
    }, [selectedEvent])

    const handleFormSubmit = (event: EventFormValues) => {
        selectedEvent ? updateEvent(event).finally(() => modalStore.closeModal()) :
            createEvent(event)
                .then(() => router.navigate(`/details/${event.eventID}`))
                .finally(() => modalStore.closeModal())
    }

    return (
        <Segment clearing loading={loadingInitial}>
            <Header as='h1' color="blue" content={selectedEvent ? 'Update Event' : 'Create Event'} />
            <Formik
                enableReinitialize={true}
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
                                name='attendDeadline'
                                placeholderText='Attend Deadline'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />

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

                            <SelectInput
                                name='publicity'
                                placeholder='Publictiy'
                                options={publicityOptions} />



                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting}
                                floated="right"
                                positive
                                type="submit"
                                content={selectedEvent ? 'Update' : 'Create'} />
                            <Button
                                disabled={isSubmitting}
                                floated="right"
                                type="button"
                                content='Cancel'
                                onClick={() => modalStore.closeModal()} />

                            <Button
                                disabled={isSubmitting}
                                floated="left"
                                type="button"
                                content='Our Rules For Event'
                                icon="list"
                                color="blue"
                                onClick={() => modalStore.openModal(<EventRules />)} />
                        </Form>
                    )
                }
            </Formik>
        </Segment>
    )
}

export default observer(EventForm)