import { Field, useField } from "formik"
import { Form } from "semantic-ui-react"
import ErrorText from "./ErrorText"

interface Props {
    placeholder: string
    name: string
    label?: string
    type?: string
}


const TextInput = (props: Props) => {
    const [field, meta] = useField(props.name) // useField(props.name) ties up to the matching field

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={props.name} className="label">{props.label}</label>
            <Field {...field} {...props} />
            {meta.touched && meta.error && (<ErrorText error={meta.error} />)}
        </Form.Field>
    )
}

export default TextInput