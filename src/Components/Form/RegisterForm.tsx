import { Form, Formik } from 'formik';
import { Header, Segment, Button } from 'semantic-ui-react';
import '../../Stylesheets/Formik.css'
import '../../Stylesheets/Login&Register.css'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../Stores/store';
import TextInput from '../FormikControls/TextInput';
import * as Yup from 'yup'
import SelectInput from '../FormikControls/SelectInput';
import { genderOptions } from '../../Utilities/dropdownOptions';
import DateInput from '../FormikControls/DateInput';
import emailjs from '@emailjs/browser';
import { RegisterModel } from '../../Interfaces/user';
import { runInAction } from 'mobx';
import { toast } from 'react-toastify';
import axiosAgent from '../../API/axiosAgent';
import { EmailSenderValues } from '../../Utilities/staticValues';
import SuccessModal from '../Common/SuccessModal';
import { useState } from 'react';

const RegisterForm = () => {
    const { modalStore } = useStore()
    const ageValidator = new Date().setFullYear(new Date().getFullYear() - 16)
    const phoneNumberValidator = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (registerInfo: RegisterModel) => {
        try {
            setIsLoading(true)
            const userPassword = await axiosAgent.AccountActions.register(registerInfo)

            runInAction(() => {
                emailjs.init(EmailSenderValues.PublicKey)

                const emailParams = {
                    senderName: "REVENT SYSTEM",
                    to: registerInfo.email,
                    subject: "Register Password",
                    message: "Your password is: " + userPassword
                };

                emailjs.send(EmailSenderValues.ServiceKey, EmailSenderValues.TemplateID, emailParams)
                    .then(() => modalStore.openModal(<SuccessModal message="Create Account Successfully" />))
                    .catch(() => toast.error("Error sending email"))
                    .finally(() => setIsLoading(false))
            })
        }
        catch (error) {
            console.log(error)
        }
    }

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
                onSubmit={(values) => handleSubmit(values)}
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

                {({ handleSubmit, isSubmitting, dirty, isValid }) => (
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
                            dateFormat='dd/MM/yyyy' />

                        <Button
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting || isLoading}
                            type='submit'
                            color='green'
                            content='Register'
                            floated="right" />
                        <Button
                            disabled={isSubmitting || isLoading}
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