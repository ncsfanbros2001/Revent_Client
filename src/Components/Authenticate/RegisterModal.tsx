import { Fragment, useState } from "react"
import { Button, Grid, Modal } from "semantic-ui-react"
import { Form, Formik } from "formik"
import * as Yup from 'yup'
import TextInput from "../../FormikControls/TextInput"
import DatePicker from "../../FormikControls/DatePicker"
import Dropdown from "../../FormikControls/Dropdown"

const RegisterModal = () => {
    const [openRegister, setOpenRegister] = useState(false)

    const genderOptions = [
        { key: '--Giới Tính--', value: null, hidden: true },
        { key: 'Nam', value: 'male', hidden: false },
        { key: 'Nữ', value: 'female', hidden: false }
    ]

    const registerInitialValues = {
        firstName: '',
        lastName: '',
        email: '',
        birthDate: null,
        gender: '',
        password: '',
        confirmPassword: ''
    }

    const registerValidationSchema = Yup.object({
        firstName: Yup.string().required('Cần nhập họ'),
        lastName: Yup.string().required('Cần nhập tên'),
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Cần nhập địa chỉ email'),
        birthDate: Yup.date().required('Cần nhập ngày sinh'),
        gender: Yup.string().required('Cần nhập giới tính')
    })

    const onSubmit = (values: any) => {
        console.log(values)
        setOpenRegister(false)
    }

    return (
        <Modal
            id="register_modal"
            size="tiny"
            open={openRegister}
            trigger={
                <Button
                    type='submit'
                    className="buttonControls"
                    color="blue"
                    onClick={() => setOpenRegister(true)}
                >
                    Tạo Tài Khoản Mới
                </Button>
            }
        >

            <Formik
                initialValues={registerInitialValues}
                validationSchema={registerValidationSchema}
                onSubmit={onSubmit}
            >
                {
                    (formik: any) => (
                        <Fragment>
                            <Modal.Header id="register_modal_header" content='Đăng ký tài khoản mới' />

                            <Modal.Content>
                                <Form>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={8}>
                                                <TextInput
                                                    headerLabel='Tên'
                                                    name='firstName'
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>

                                            <Grid.Column width={8}>
                                                <TextInput
                                                    headerLabel='Họ'
                                                    name='lastName'
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <TextInput
                                                    headerLabel='Email'
                                                    name='email'
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column width={8}>
                                                <DatePicker
                                                    headerLabel='Ngày sinh'
                                                    name='birthDate'
                                                    stylingClass='registerInputField'
                                                />
                                            </Grid.Column>

                                            <Grid.Column width={8}>
                                                <Dropdown
                                                    headerLabel='Giới tính'
                                                    name='gender'
                                                    options={genderOptions}
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column width={8}>
                                                <TextInput
                                                    headerLabel='Mật khẩu'
                                                    type='password'
                                                    name='password'
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>

                                            <Grid.Column width={8}>
                                                <TextInput
                                                    headerLabel='Nhập lại mật khẩu'
                                                    type='password'
                                                    name='confirmPassword'
                                                    stylingClass='registerInputField' />
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row centered>
                                            <Grid.Column width={8} textAlign="right">
                                                <Button
                                                    color='red'
                                                    content="Hủy"
                                                    icon='x'
                                                    onClick={() => setOpenRegister(false)}
                                                />
                                            </Grid.Column>

                                            <Grid.Column width={8}>
                                                <Button
                                                    type="submit"
                                                    color='green'
                                                    content="Đăng Ký"
                                                    icon='checkmark'
                                                    disabled={!formik.isValid}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form>
                            </Modal.Content>
                        </Fragment>
                    )
                }
            </Formik>
        </Modal>
    )
}

export default RegisterModal