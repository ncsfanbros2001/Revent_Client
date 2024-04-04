import { Form, Formik } from 'formik';
import { Container, Grid, Header, Segment, Divider, Button } from 'semantic-ui-react';
import '../Stylesheets/Login&Register.css'
import TextInput from '../Components/FormikControls/TextInput';
import RegisterModal from '../Components/Form/RegisterModal';
import '../Stylesheets/Formik.css'

const Login = () => {
    const onSubmit = async (values: any, actions: any) => {
        console.log(values)
        await new Promise((resolve: any) => setTimeout(resolve, 1000))
        actions.resetForm();
    }

    const initialValues = {
        email: '',
        password: ''
    }


    return (
        <Container id='content_container'>
            <Grid verticalAlign='middle' id='login_grid_system'>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Container id='logo_container'>
                            <Header as='h1' id='logo' content='Revent' icon='universal access' />
                            <p id='slogan'>Hãy bắt đầu sự kiện của bạn với Revent.</p>
                        </Container>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Segment id='login_form_segment'>
                            <Header
                                content='Đăng Nhập'
                                as='h1'
                                textAlign="center"
                                color="blue"
                                className="formHeader" />

                            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                                {() => (
                                    <Form>
                                        {/* <TextInput
                                            headerLabel='Email'
                                            name='email'
                                            stylingClass='loginInputField' />

                                        <TextInput
                                            headerLabel='Mật khẩu'
                                            name='password'
                                            stylingClass='loginInputField'
                                            type='password' /> */}

                                        <Button type='submit' className='buttonControls' color='green' content='Đăng Nhập' />
                                        <Button className='buttonControls' color='grey' content='Quên Mật Khẩu' />
                                    </Form>
                                )}
                            </Formik>
                            <Divider horizontal>Hoặc</Divider>

                            <RegisterModal />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container >
    );
};

export default Login