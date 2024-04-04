import { Link } from "react-router-dom"
import { Button, Header, Icon, Segment } from "semantic-ui-react"

const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name="search" />
                What you looking for is unavailable
            </Header>

            <Segment.Inline>
                <Button as={Link} to='/' content='Return to activities page' />
            </Segment.Inline>
        </Segment>
    )
}

export default NotFound