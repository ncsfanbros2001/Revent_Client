import { Formik } from "formik"
import { observer } from "mobx-react-lite"
import { Segment, Header, Form, Button } from "semantic-ui-react"
import * as Yup from 'yup'
import { useStore } from "../../Stores/store"
import TextAreaInput from "../FormikControls/TextAreaInput"
import { EventsModel } from "../../Interfaces/event"

interface Props {
    event: EventsModel
}

const ReportForm = ({ event }: Props) => {
    const { modalStore, reportStore } = useStore()

    return (
        <Segment clearing>
            <Header as='h1' color="blue" content={"Reports " + event.title} />
            <Formik
                initialValues={{
                    fouls: '',
                }}
                onSubmit={(values) => reportStore.sendReport(values.fouls, event.hostUserID, event.eventID)}
                validationSchema={Yup.object({
                    fouls: Yup.string().required('Please enter the fouls that this event has committed')
                })}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <TextAreaInput
                                name='fouls'
                                placeholder='The fouls that this event has committed'
                                rows={5} />

                            <Button
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                type='submit'
                                color='green'
                                content='Send Report'
                                floated="right" />
                            <Button
                                disabled={isSubmitting}
                                color='grey'
                                content='Cancel'
                                floated="right"
                                onClick={() => modalStore.closeModal()} />
                        </Form>
                    )
                }
            </Formik>
        </Segment>
    )
}

export default observer(ReportForm)