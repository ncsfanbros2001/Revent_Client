import { ErrorMessage, Field, useField } from "formik"
import { Form } from "semantic-ui-react"
import ErrorText from "./ErrorText"


const Input = (attributes: any) => {

    const [field, meta] = useField(attributes)
    const { headerLabel, name, stylingClass, ...rest } = attributes;

    return (
        <Form.Field>
            <label htmlFor={name} className="label">{headerLabel}</label>
            <Field
                id={name}
                placeholder={headerLabel + '...'}
                {...field}
                {...rest}
                className={stylingClass + (meta.touched && meta.error ? ' errorOutline' : '')} />
            <ErrorMessage name={name} component={ErrorText} />
        </Form.Field>
    )
}

export default Input