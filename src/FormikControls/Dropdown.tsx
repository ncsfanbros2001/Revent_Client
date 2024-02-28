import { ErrorMessage, Field, useField } from "formik";
import { Form } from "semantic-ui-react";
import ErrorText from "./ErrorText";

const Dropdown = (attributes: any) => {

    const { headerLabel, name, options, stylingClass, ...rest } = attributes;
    const [field, meta] = useField(attributes);

    return (
        <Form.Field>
            <label htmlFor={name} className="label">{headerLabel}</label>
            <Field
                id={name}
                className={stylingClass + (meta.touched && meta.error ? ' errorOutline' : '')}
                as='select'
                {...field}
                {...rest}
            >
                {options && options.map((option: any) => (
                    <option
                        key={option.key}
                        value={option.value}
                        hidden={option.hidden}
                    >
                        {option.key}
                    </option>
                ))}
            </Field>
            <ErrorMessage name={name} component={ErrorText} />
        </Form.Field>
    )
}

export default Dropdown