import { useField } from "formik"
import { Form, Select } from "semantic-ui-react"
import ErrorText from "./ErrorText"

interface Props {
    placeholder: string
    name: string
    label?: string
    options: { text: string, value: string }[]
}


const SelectInput = (props: Props) => {
    const [field, meta, helpers] = useField(props.name) // useField(props.name) ties up to the matching field

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={props.name} className="label">{props.label}</label>
            <Select
                name={props.name}
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(_, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder} />
            {meta.touched && meta.error && (<ErrorText error={meta.error} />)}
        </Form.Field>
    )
}

export default SelectInput