import { ErrorMessage, Form, Formik } from 'formik';
import { Container, Grid, Header, Segment, Divider, Button, Label, Checkbox } from 'semantic-ui-react';
import '../Stylesheets/Login&Register.css'
import '../Stylesheets/Formik.css'
import TextInput from '../Components/FormikControls/TextInput';
import { useStore } from '../Stores/store';
import { observer } from 'mobx-react-lite';
import RegisterForm from '../Components/Form/RegisterForm';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import RetrievePasswordForm from '../Components/Form/RetrievePasswordForm';

const Login = () => {
    const { userStore, modalStore } = useStore()
    const [passwordHidden, setPasswordHidden] = useState(true)
    const [failedLoginAttempt, setFailedLoginAttempt] = useState(0)
    const [loginLocked, setLoginLocked] = useState(false)
    const [loginDisabledUntil, _] = useState(Number(localStorage.getItem('loginDisabledUntil')))
    const [labelHidden, setLabelHidden] = useState(true)

    useEffect(() => {
        if (new Date(loginDisabledUntil) > new Date()) {
            setLoginLocked(true)
            setLabelHidden(false)
        }
        else {
            setLoginLocked(false)
            localStorage.removeItem('loginDisabledUntil')
        }
    }, [loginDisabledUntil])

    return (
        <Container id='content_container'>
            <Grid verticalAlign='middle' id='login_grid_system'>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Container id='logo_container'>
                            <Header as='h1' id='logo' content='Revent' icon='universal access' />
                            <p id='slogan'>Let's start your event with Revent.</p>
                        </Container>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Segment id='login_form_segment'>
                            <Header
                                content='Login'
                                as='h1'
                                textAlign="center"
                                color="blue"
                                className="formHeader" />

                            <Formik
                                initialValues={
                                    {
                                        email: '',
                                        password: '',
                                        error: null
                                    }
                                }
                                onSubmit={
                                    async (values, { setErrors }) => {
                                        return await userStore.login(values)
                                            .catch(() => {
                                                setFailedLoginAttempt(failedLoginAttempt + 1)

                                                if (failedLoginAttempt === 4) {
                                                    const lockUntil = new Date().setMinutes(new Date().getMinutes() + 5).toString()

                                                    localStorage.setItem("loginDisabledUntil", lockUntil)
                                                    setLoginLocked(true)
                                                    setErrors({ error: `Too many failed login attempt, please wait until ${format(new Date(Number(lockUntil)), 'p')} to login again` })
                                                }
                                            })
                                    }
                                }>

                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                        <TextInput
                                            name='email'
                                            placeholder='Email'
                                            disabled={loginLocked} />

                                        <TextInput
                                            name='password'
                                            placeholder='Password'
                                            type={passwordHidden ? "password" : "text"}
                                            disabled={loginLocked} />

                                        <ErrorMessage
                                            name='error'
                                            render={() => (
                                                <Label
                                                    style={{ marginBottom: 10, width: '100%', textAlign: 'center' }}
                                                    basic
                                                    color='red'
                                                    content={errors.error} />
                                            )} />

                                        {
                                            loginLocked && loginDisabledUntil && !labelHidden && (
                                                <Label
                                                    style={{ marginBottom: 10, width: '100%', textAlign: 'center' }}
                                                    basic
                                                    color='red'
                                                    content={`Too many failed attempt, please wait 
                                                        until ${format(new Date(loginDisabledUntil), 'p')} to try again`} />
                                            )
                                        }

                                        <Checkbox
                                            label='Show Password'
                                            disabled={loginLocked}
                                            onChange={() => setPasswordHidden(!passwordHidden)} />

                                        <Button
                                            loading={isSubmitting}
                                            type='submit'
                                            className='buttonControls'
                                            color='green'
                                            content='Login'
                                            disabled={loginLocked} />
                                    </Form>
                                )}
                            </Formik>

                            <Divider horizontal>Or</Divider>

                            <Button
                                className='buttonControls'
                                color='grey'
                                content='Forgot Password'
                                onClick={() => modalStore.openModal(<RetrievePasswordForm />)} />

                            <Button
                                className='buttonControls'
                                color="blue"
                                content='Create new Account'
                                onClick={() => modalStore.openModal(<RegisterForm />)} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default observer(Login)