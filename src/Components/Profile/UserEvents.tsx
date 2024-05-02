import { SyntheticEvent, useEffect } from "react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import { Card, Grid, Header, Tab, TabProps, Image, Container } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"

const UserEvents = () => {
    const { profileStore } = useStore()
    const { loadUserEvents, profile, userEvents } = profileStore

    const panes = [
        { menuItem: "Future Events", pane: { key: 'future' } },
        { menuItem: "Past Events", pane: { key: 'past' } },
        { menuItem: "Hosting", pane: { key: 'hosting' } },
    ]

    useEffect(() => {
        loadUserEvents(profile!.userID)
    }, [loadUserEvents, profile])

    const handleTabChanges = (_: SyntheticEvent, data: TabProps) => {
        loadUserEvents(profile!.userID, panes[data.activeIndex as number].pane.key)
    }

    return (
        <Grid>
            <Grid.Column width={16}>
                <Header floated="left" icon="calendar" content="Events List" />
            </Grid.Column>
            <Grid.Column width={16}>
                <Tab
                    panes={panes}
                    menu={{ secondary: true, pointing: true }}
                    onTabChange={(e, data) => handleTabChanges(e, data)} />

                <br />

                <Card.Group itemsPerRow={4}>
                    {userEvents.length > 0 ? userEvents.map((event) => (
                        <Card
                            as={Link}
                            to={`/details/${event.eventID}`}
                            key={event.eventID}
                        >
                            <Image src='/public/travel.jpg' style={{ minHeight: 100, objectFit: 'cover' }} />
                            <Card.Content>
                                <Card.Header textAlign="center">{event.title}</Card.Header>
                                <Card.Meta textAlign="center">
                                    <div>{format(new Date(event.beginTime), 'do LLL')}</div>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    )) : (
                        <Container fluid textAlign="center">
                            <Header content="No Event Available" style={{ margin: '25px 5px' }} />
                        </Container>
                    )}
                </Card.Group>
            </Grid.Column>
        </Grid>
    )
}

export default observer(UserEvents)