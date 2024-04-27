import { ErrorMessage, Form, Formik } from 'formik';
import { Header, Segment, Button, Label } from 'semantic-ui-react';
import '../../Stylesheets/Formik.css'
import '../../Stylesheets/Login&Register.css'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../Stores/store';
import TextInput from '../FormikControls/TextInput';
import * as Yup from 'yup'
import SelectInput from '../FormikControls/SelectInput';
import { genderOptions } from '../../Utilities/dropdownOptions';
import DateInput from '../FormikControls/DateInput';

const RegisterForm = () => {
    const { userStore, modalStore } = useStore()
    const ageValidator = new Date().setFullYear(new Date().getFullYear() - 16)
    const phoneNumberValidator = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

    return (
        <Segment clearing>
            <Header
                content='Register'
                as='h1'
                textAlign="center"
                color="blue"
                className="formHeader" />

            <Formik
                initialValues={
                    {
                        fullname: '',
                        username: '',
                        email: '',
                        phoneNumber: '',
                        gender: '',
                        address: '',
                        birthDate: null,
                        password: '',
                        confirmPassword: '',
                        error: null
                    }
                }
                onSubmit={
                    async (values, { setErrors }) => {
                        return await userStore.register(values)
                            .then(() => modalStore.closeModal())
                            .catch(() => setErrors({ error: "Invalid register infos" }))

                    }
                }
                validationSchema={Yup.object({
                    fullname: Yup.string().required('Full name is required'),
                    username: Yup.string().required('Username is required'),
                    email: Yup.string()
                        .email('Invalid Email Format')
                        .required('Email is required'),
                    phoneNumber: Yup.string()
                        .matches(phoneNumberValidator,
                            "This is not a valid phone number")
                        .required('Phone number is required'),
                    gender: Yup.string().required('Gender is required'),
                    address: Yup.string().required('Address is required'),
                    birthDate: Yup.date()
                        .required('Birth date is required')
                        .max(new Date(ageValidator), 'You must be 16 years or older'),
                })}>

                {({ handleSubmit, isSubmitting, errors, dirty, isValid }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <TextInput
                            name='fullname'
                            placeholder='Full Name' />

                        <TextInput
                            name='username'
                            placeholder='Username' />

                        <TextInput
                            name='email'
                            placeholder='Email' />

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

                        <ErrorMessage
                            name='error'
                            render={() => (
                                <Label
                                    style={{ marginBottom: 10, width: '100%', textAlign: 'center' }}
                                    basic
                                    color='red'
                                    content={errors.error} />
                            )} />

                        <Button
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting}
                            type='submit'
                            color='green'
                            content='Register'
                            floated="right" />
                        <Button
                            color='grey'
                            content='Cancel'
                            floated="right"
                            onClick={() => modalStore.closeModal()} />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(RegisterForm)