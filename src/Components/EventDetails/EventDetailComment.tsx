import { observer } from "mobx-react-lite"
import { Fragment, useEffect } from "react"
import { Header, Segment, Comment, Button } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import { Link } from "react-router-dom"
import { Formik, Form } from "formik"
import TextAreaInput from "../FormikControls/TextAreaInput"
import * as Yup from 'yup'
import { formatDistanceToNow } from "date-fns"

interface Props {
    eventID: string
}

const EventDetailComment = ({ eventID }: Props) => {
    const { commentStore, userStore } = useStore()

    useEffect(() => {
        if (eventID) {
            commentStore.createHubConnection(eventID)
        }

        return () => commentStore.clearComments()
    }, [commentStore, eventID])

    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}>
                <Header>Comments</Header>
            </Segment>

            <Segment>
                <Segment clearing>
                    <Formik
                        onSubmit={(values, { resetForm }) => {
                            commentStore.addComment(values).then(() => resetForm())
                        }}
                        initialValues={{
                            content: '',
                            eventID: eventID,
                            userID: userStore.currentUser?.userID!
                        }}
                        validationSchema={Yup.object({
                            content: Yup.string().required("")
                        })}>
                        {({ isSubmitting, isValid }) => (
                            <Form className="ui form">
                                <TextAreaInput placeholder="" name='content' rows={2} />

                                <Button
                                    content='Add Comment'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !isValid}
                                    type="submit"
                                    floated="right" />
                            </Form>
                        )}
                    </Formik>
                </Segment>


                <Segment>
                    <Comment.Group>
                        {commentStore.comments.length > 0 ? commentStore.comments.map((comment) => (
                            <Comment key={comment.commentID}>
                                <Comment.Avatar src={comment.avatarURL || '/public/user.png'} />
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profiles/${comment.userID}`}>
                                        {comment.fullname}
                                    </Comment.Author>

                                    <Comment.Metadata>
                                        <div>{formatDistanceToNow(comment.commentTime)}</div>
                                    </Comment.Metadata>

                                    <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
                                        {comment.content}
                                    </Comment.Text>

                                </Comment.Content>
                            </Comment>
                        )) : (
                            <Header as='h5' content='Be the first one to comment !' />
                        )}
                    </Comment.Group>
                </Segment>
            </Segment>
        </Fragment>
    )
}

export default observer(EventDetailComment)