const ErrorText = (props: any) => {
    return (
        <div style={{ color: 'red' }}>
            {props.children}
        </div>
    )
}

export default ErrorText