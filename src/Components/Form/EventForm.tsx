import { Button, Segment } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { EventFormValues, EventsModel } from "../../Interfaces/event"
import LoadingComponent from "../Common/LoadingComponent"
import { Formik, Form } from "formik"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import SelectInput from "../FormikControls/SelectInput"
import { eventCategoryOptions, publicityOptions } from "../../Utilities/dropdownOptions"
import DateInput from "../FormikControls/DateInput"
import TextAreaInput from "../FormikControls/TextAreaInput"

interface Props {
    selectedEvent?: EventsModel
}

const EventForm = (props: Props) => {
    const { eventStore, modalStore, userStore } = useStore()
    const { createEvent, updateEvent, loadingInitial } = eventStore
    const { selectedEvent } = props

    const [eventInfo, setEventInfo] = useState<EventFormValues>(new EventFormValues())

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        wallpaper: Yup.string().required('Wallpaper is required'),
        location: Yup.string().required('Location is required'),
        beginTime: Yup.string().required('Begin Time is required'),
        endTime: Yup.string().required('End Time is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        publicity: Yup.string().required('Publicity is required'),
        attendDeadline: Yup.string().required('Attend Deadline is required')
    })

    useEffect(() => {
        if (selectedEvent) {
            setEventInfo(new EventFormValues(selectedEvent))
        }
    }, [selectedEvent])

    const handleFormSubmit = (event: EventFormValues) => {
        selectedEvent ? updateEvent({
            eventToUpsert: event,
            hostUserID: userStore.currentUser?.userID!
        }) : createEvent({
            eventToUpsert: event,
            hostUserID: userStore.currentUser?.userID!
        });

        modalStore.closeModal()
    }

    if (loadingInitial) return <LoadingComponent content="Loading Event..." />

    return (
        <Segment clearing>
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

                            <DateInput
                                name='attendDeadline'
                                placeholderText='Attend Deadline'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />



                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting}
                                floated="right"
                                positive type="submit"
                                content='Submit' />
                            <Button
                                floated="right"
                                type="button"
                                content='Cancel'
                                onClick={() => modalStore.closeModal()} />
                        </Form>
                    )
                }
            </Formik>
        </Segment>
    )
}

export default observer(EventForm)