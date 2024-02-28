import 'react-datepicker/dist/react-datepicker.css'
import Datepicker from 'react-datepicker'
import { Form } from 'semantic-ui-react'
import { ErrorMessage, Field, useField } from 'formik'
import ErrorText from './ErrorText'

const DatePicker = (attributes: any) => {
    const { headerLabel, name, stylingClass, ...rest } = attributes
    const [field, meta] = useField(attributes)

    return (
        <Form.Field>
            <label htmlFor={name} className="label">{headerLabel}</label>
            <Field>
                {
                    ({ form }: any) => {
                        return <Datepicker
                            showIcon
                            className={stylingClass + (meta.touched && meta.error ? ' errorOutline' : '')}
                            id={name}
                            {...field}
                            {...rest}
                            selected={field.value}
                            dateFormat="dd/MM/yyyy"
                            placeholderText={headerLabel + "..."}
                            onChange={(value: any) => form.setFieldValue(name, value)} />
                    }
                }
            </Field>
            <ErrorMessage name={name} component={ErrorText} />
        </Form.Field>
    )
}

export default DatePicker