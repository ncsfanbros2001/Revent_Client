import { Button, Form, Header, Segment } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { runInAction } from "mobx"
import { toast } from "react-toastify"
import axiosAgent from "../../API/axiosAgent"
import { EmailSenderValues } from "../../Utilities/staticValues"
import emailjs from '@emailjs/browser';
import SuccessModal from "../Common/SuccessModal"

const RetrievePasswordForm = () => {
    const { modalStore } = useStore()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)

        await axiosAgent.AccountActions.retrievePassword(email)
            .then((response) => {
                runInAction(() => {
                    emailjs.init(EmailSenderValues.PublicKey)

                    const emailParams = {
                        senderName: "REVENT SYSTEM",
                        to: email,
                        subject: "New Password",
                        message: "Your new password is: " + response
                    };

                    emailjs.send(EmailSenderValues.ServiceKey, EmailSenderValues.TemplateID, emailParams)
                        .then(() => modalStore.openModal(<SuccessModal message="Change Password Successfully" />))
                        .catch(() => toast.error("Error sending email"))
                })
            })
            .catch((error) => {
                toast.error(error.response.data)
            })
            .finally(() => {
                runInAction(() => setLoading(false))
            })

    }

    return (
        <Segment clearing>
            <Header as='h1' color="blue" content='Retrieve your password' />
            <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                <Form.Field>
                    <Form.Input fluid placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} />
                </Form.Field>

                <Button
                    disabled={loading}
                    loading={loading}
                    type='submit'
                    color='green'
                    content='Send'
                    floated="right" />
                <Button
                    disabled={loading}
                    color='grey'
                    content='Cancel'
                    floated="right"
                    onClick={() => modalStore.closeModal()} />
            </Form>
        </Segment>
    )
}

export default observer(RetrievePasswordForm)