import { Grid, Icon, Segment } from "semantic-ui-react"
import { Events } from "../../Interfaces/event"
import { format } from "date-fns"

interface Props {
    event: Events
}

const EventDetailInfo = ({ event }: Props) => {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{event.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>{format(event.beginTime!, 'dd MMM yyyy h:mm aa')}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>{event.location}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default EventDetailInfo