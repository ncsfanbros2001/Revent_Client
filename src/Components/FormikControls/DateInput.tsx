import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Form } from 'semantic-ui-react'
import { useField } from 'formik'
import ErrorText from './ErrorText'

const DateInput = (props: Partial<ReactDatePickerProps>) => { // Make everything in partial optional
    const [field, meta, helpers] = useField(props.name!)

    return (
        <Form.Field error={!!meta.error && meta.value}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value) && new Date(field.value) || null}
                onChange={(value) => helpers.setValue(value)}
            />
            {meta.error && meta.value && (<ErrorText error={meta.error} />)}
        </Form.Field>
    )
}

export default DateInput