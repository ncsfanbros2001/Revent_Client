import { observer } from "mobx-react-lite"
import { Fragment } from "react/jsx-runtime"
import { Placeholder, Segment } from "semantic-ui-react"

const EventItemPlaceholder = () => {
    return (
        <Fragment>
            <Placeholder fluid style={{ marginTop: 25 }}>
                <Segment.Group>
                    <Segment style={{ minHeight: 110 }}>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </Segment>
                    <Segment secondary style={{ minHeight: 70 }} />
                </Segment.Group>
            </Placeholder>
        </Fragment>
    )
}

export default observer(EventItemPlaceholder)