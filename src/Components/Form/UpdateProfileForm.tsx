import { Formik, Form } from "formik"
import { useState } from "react"
import { UpdateProfileModel } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import DateInput from "../FormikControls/DateInput"
import SelectInput from "../FormikControls/SelectInput"
import { genderOptions } from "../../Utilities/dropdownOptions"
import TextAreaInput from "../FormikControls/TextAreaInput"
import { Button, Segment } from "semantic-ui-react"

const UpdateProfileForm = () => {
    const { userStore, modalStore, profileStore } = useStore()
    const [userProfile, _] = useState<UpdateProfileModel>(new UpdateProfileModel(profileStore.profile!))

    const validationSchema = Yup.object({
        fullname: Yup.string().required('Fullname cannot be empty'),
        username: Yup.string().required('Username cannot be empty'),
        phoneNumber: Yup.number().required('Phone Number cannot be empty'),
        gender: Yup.string().required('Gender cannot be empty'),
        address: Yup.string().required('Address cannot be empty'),
        birthDate: Yup.string().required('Birth Date cannot be empty'),
        biography: Yup.string().required('Biography cannot be empty')
    })

    return (
        <Segment clearing>
            <Formik
                initialValues={userProfile}
                onSubmit={(values) => userStore.updateProfile(values).then(() => modalStore.closeModal())}
                validationSchema={validationSchema}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <TextInput
                                name='fullname'
                                placeholder='Fullname' />

                            <TextInput
                                name='username'
                                placeholder='Username' />

                            <TextInput
                                name='phoneNumber'
                                placeholder='Phone Number' />

                            <SelectInput
                                name='gender'
                                placeholder='Gender'
                                options={genderOptions} />

                            <TextInput
                                name='address'
                                placeholder='Address' />

                            <DateInput
                                name='birthDate'
                                placeholderText='Date of Birth'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy' />

                            <TextAreaInput
                                name='biography'
                                placeholder='Biography'
                                rows={5} />

                            <Button
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                type='submit'
                                color='green'
                                content='Update Profile'
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

export default observer(UpdateProfileForm)