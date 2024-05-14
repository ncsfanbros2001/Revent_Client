import { Fragment } from "react"
import { Link } from "react-router-dom"
import { Item, Label, List, Segment, Image, Button } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import { EventStatus } from "../../Utilities/staticValues"

interface Props {
    event: EventsModel
}

const EventDetailGuestList = ({ event: { guests, host, eventID, status } }: Props) => {
    const { userStore, eventStore } = useStore()

    if (!guests) return null
    return (
        <Fragment>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'>
                {guests.length} {guests.length === 1 ? "Person" : 'Peoples'} Going
            </Segment>
            <Segment attached >
                <List relaxed divided style={{ maxHeight: 500, overflowY: 'auto' }}>
                    {guests.map((guest) => (
                        <Item style={{ position: 'relative', width: '90%' }} key={guest.userID}>
                            {guest.userID === host?.userID &&
                                <Label
                                    style={{ position: 'absolute' }}
                                    color='orange'
                                    ribbon='right'
                                >
                                    Host
                                </Label>}

                            <Image size='tiny' src={guest.avatarURL || '/public/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profiles/${guest.userID}`}>{guest.fullname}</Link>
                                </Item.Header>
                                {guest.following && <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
                            </Item.Content>

                            {host?.userID === userStore.currentUser?.userID
                                && eventStore.selectedEvent?.attendDeadline! < new Date()
                                && guest.userID !== host?.userID && status !== EventStatus.Cancelled && (
                                    <Button
                                        color="red"
                                        content='Remove'
                                        icon='remove user'
                                        size="mini"
                                        floated="right"
                                        onClick={() => eventStore.removeGuest(guest.userID, eventID)}
                                        loading={eventStore.loading}
                                        disabled={eventStore.loading} />
                                )}
                        </Item>
                    ))}

                </List>
            </Segment>
        </Fragment>
    )
}

export default observer(EventDetailGuestList)