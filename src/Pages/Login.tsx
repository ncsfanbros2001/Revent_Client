import { ErrorMessage, Form, Formik } from 'formik';
import { Container, Grid, Header, Segment, Divider, Button, Label } from 'semantic-ui-react';
import '../Stylesheets/Login&Register.css'
import '../Stylesheets/Formik.css'
import TextInput from '../Components/FormikControls/TextInput';
import { useStore } from '../Stores/store';
import { observer } from 'mobx-react-lite';
import RegisterForm from '../Components/Form/RegisterForm';

const Login = () => {
    const { userStore, modalStore } = useStore()

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
                                        return await userStore.login(values).catch(() => setErrors({ error: "Invalid credentials" }))
                                    }
                                }>

                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                        <TextInput
                                            name='email'
                                            placeholder='Email' />

                                        <TextInput
                                            name='password'
                                            placeholder='Password'
                                            type='password' />

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
                                            loading={isSubmitting}
                                            type='submit'
                                            className='buttonControls'
                                            color='green'
                                            content='Login' />
                                    </Form>
                                )}
                            </Formik>

                            <Divider horizontal>Or</Divider>

                            <Button
                                className='buttonControls'
                                color='grey'
                                content='Forgot Password' />
                            <Button
                                className='buttonControls'
                                color="blue"
                                onClick={() => modalStore.openModal(<RegisterForm />)}>
                                Create new Account
                            </Button>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default observer(Login)