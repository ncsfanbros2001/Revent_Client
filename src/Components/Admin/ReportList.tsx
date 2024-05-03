import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStore } from "../../Stores/store"
import { Button, Grid, Header, Icon, Item, Segment } from "semantic-ui-react"
import { Link } from "react-router-dom"
import LoadingComponent from "../Common/LoadingComponent"
import { format, formatDistanceToNow } from "date-fns"
import EventDetails from "../../Pages/EventDetails"
import ConfirmJudgement from "../Common/ConfirmJudgement"

const ReportList = () => {
    const { reportStore, modalStore, eventStore } = useStore()
    const { getReports, reports, loading } = reportStore

    useEffect(() => {
        getReports()
    }, [])

    if (loading) return <LoadingComponent content="Loading Reports..." />
    return (
        <Grid.Row style={{ display: "flex", flexDirection: "column" }}>
            <Grid.Column width={10}>
                {reports.length > 0 ? reports.map((report) => (
                    <Segment.Group key={report.reportID}>
                        <Segment>
                            <Item.Group>
                                <Item>
                                    <Item.Image size='tiny' circular src={report.reporter.avatarURL || '/public/user.png'} />

                                    <Item.Content>
                                        <Item.Header as={Link}>{report.reporter.fullname}</Item.Header>
                                        <Item.Description content={formatDistanceToNow(report.sendTime) + " ago"} />
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Segment>

                        <Segment attached>
                            <Grid verticalAlign='middle'>
                                <Grid.Column width={1}>
                                    <Icon name='question circle outline' size='large' color='teal' />
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <span>{report.foulCommited}</span>
                                </Grid.Column>
                            </Grid>
                        </Segment>

                        <Segment>
                            <Segment attached='top'>
                                <Grid>
                                    <Grid.Column width={1}>
                                        <Icon size='large' color='teal' name='info' />
                                    </Grid.Column>
                                    <Grid.Column width={15}>
                                        <p>{report.event.description}</p>
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                            <Segment attached>
                                <Grid verticalAlign='middle'>
                                    <Grid.Column width={1}>
                                        <Icon name='calendar' size='large' color='teal' />
                                    </Grid.Column>
                                    <Grid.Column width={15}>
                                        <span>
                                            {format(report.event.beginTime!, 'dd MMM yyyy h:mm aa')}
                                        </span>
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                            <Segment attached>
                                <Grid verticalAlign='middle'>
                                    <Grid.Column width={1}>
                                        <Icon name='map marker alternate' size='large' color='teal' />
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        {report.event.location}
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                        </Segment>

                        <Segment>
                            <Button
                                content='View Details'
                                icon='eye'
                                positive
                                onClick={() => {
                                    eventStore.loadOneEvent(report.event.eventID)
                                        .then(() => modalStore.openModal(<Segment><EventDetails /></Segment>, true))
                                }} />

                            <Button
                                content='Penalize'
                                icon='ban'
                                color="red"
                                floated="right"
                                onClick={() =>
                                    modalStore.openModal(<ConfirmJudgement isGuilty={true} reportID={report.reportID} />)} />

                            <Button
                                content='Its Okay'
                                icon='hand paper outline'
                                primary
                                floated="right"
                                onClick={() =>
                                    modalStore.openModal(<ConfirmJudgement isGuilty={false} reportID={report.reportID} />)} />
                        </Segment>
                    </Segment.Group>
                )) : (
                    <Header as='h1' content='Congratulations ! There are no reports for now !' />
                )}

            </Grid.Column>
        </Grid.Row>
    )
}

export default observer(ReportList)