import { Grid, Icon, Segment } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { format } from "date-fns"
import { observer } from "mobx-react-lite"

interface Props {
    event: EventsModel
}

const EventDetailInfo = ({ event }: Props) => {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <b>Description: </b>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <p>{event.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='hourglass end' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <b>Attend Deadline: </b>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <span>
                            {format(event.attendDeadline!, 'dd MMM yyyy h:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <b>Duration: </b>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <span>
                            {format(event.beginTime!, 'dd MMM yyyy h:mm aa')} - {format(event.endTime!, 'dd MMM yyyy h:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='map marker alternate' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <b>Location: </b>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <span>{event.location}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='columns' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <b>Category: </b>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <span>{event.category}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default observer(EventDetailInfo)