import { Formik, Form } from "formik"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import { Button, Checkbox, Header, Segment } from "semantic-ui-react"
import { useState } from "react"

const ChangePasswordForm = () => {
    const { userStore, modalStore } = useStore()
    const [passwordHidden, setPasswordHidden] = useState(true)

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required('Old Password cannot be empty'),
        newPassword: Yup.string().required('New Password cannot be empty'),
        confirmPassword: Yup.string().required('Confirm Password cannot be empty')
    })

    return (
        <Segment clearing>
            <Header as='h1' color="blue" content='Change Password' />
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }}
                onSubmit={(values) => userStore.changePassword(values).then(() => modalStore.closeModal())}
                validationSchema={validationSchema}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <TextInput
                                name='oldPassword'
                                placeholder='Old Password'
                                type={passwordHidden ? "password" : "text"} />

                            <TextInput
                                name='newPassword'
                                placeholder='New Password'
                                type={passwordHidden ? "password" : "text"} />

                            <TextInput
                                name='confirmPassword'
                                placeholder='Confirm Password'
                                type={passwordHidden ? "password" : "text"} />

                            <Checkbox label='Show Password' onChange={() => setPasswordHidden(!passwordHidden)} />
                            <Button
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                type='submit'
                                color='green'
                                content='Change Password'
                                floated="right" />
                            <Button
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

export default observer(ChangePasswordForm)