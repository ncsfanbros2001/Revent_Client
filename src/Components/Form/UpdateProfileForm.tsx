import { Formik, Form } from "formik"
import { UpdateProfileModel } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import * as Yup from 'yup'
import TextInput from "../FormikControls/TextInput"
import DateInput from "../FormikControls/DateInput"
import SelectInput from "../FormikControls/SelectInput"
import { genderOptions } from "../../Utilities/dropdownOptions"
import TextAreaInput from "../FormikControls/TextAreaInput"
import { Button, Header, Segment } from "semantic-ui-react"

const UpdateProfileForm = () => {
    const { userStore, modalStore, profileStore } = useStore()
    const ageValidator = new Date().setFullYear(new Date().getFullYear() - 16)
    const phoneNumberValidator = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

    const validationSchema = Yup.object({
        fullname: Yup.string().required('Fullname cannot be empty'),
        username: Yup.string().required('Username cannot be empty'),
        phoneNumber: Yup.string()
            .required('Phone Number cannot be empty')
            .matches(phoneNumberValidator,
                "This is not a valid phone number"),
        gender: Yup.string().required('Gender cannot be empty'),
        address: Yup.string().required('Address cannot be empty'),
        birthDate: Yup.date()
            .required('Birth date is required')
            .max(new Date(ageValidator), 'You must be 16 years or older'),
        biography: Yup.string().required('Biography cannot be empty')
    })

    return (
        <Segment clearing>
            <Header as='h1' color="blue" content='Update Profile' />
            <Formik
                initialValues={new UpdateProfileModel(profileStore.profile!)}
                onSubmit={(values) => userStore.updateProfile(values)}
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