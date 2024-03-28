import { Button, Form, Segment } from "semantic-ui-react"

interface Props {
    handleFormClose: () => void
}

const EventForm = (props: Props) => {
    const { handleFormClose } = props

    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder="Title" />
                <Form.TextArea placeholder="Description" />
                <Form.Input placeholder="Category" />
                <Form.Input placeholder="Begin Date" />
                <Form.Input placeholder="Location" />
                <Button floated="right" positive type="submit" content='Submit' />
                <Button floated="right" type="button" content='Cancel' onClick={() => handleFormClose()} />
            </Form>
        </Segment>
    )
}

export default EventForm