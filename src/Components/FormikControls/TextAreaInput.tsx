import { useField } from "formik"
import { Form, TextArea } from "semantic-ui-react"
import ErrorText from "./ErrorText"

interface Props {
    placeholder: string
    name: string
    label?: string
    rows: number
}


const TextAreaInput = (props: Props) => {
    const [field, meta] = useField(props.name) // useField(props.name) ties up to the matching field

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={props.name} className="label">{props.label}</label>
            <TextArea {...field} {...props} />
            {meta.touched && meta.error && (<ErrorText error={meta.error} />)}
        </Form.Field>
    )
}

export default TextAreaInput