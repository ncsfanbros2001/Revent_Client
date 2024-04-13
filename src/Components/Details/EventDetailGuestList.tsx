import { Fragment } from "react"
import { Link } from "react-router-dom"
import { Item, Label, List, Segment, Image } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { observer } from "mobx-react-lite"

interface Props {
    event: EventsModel
}

const EventDetailGuestList = ({ event: { guests, host } }: Props) => {

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
            <Segment attached>
                <List relaxed divided>
                    {guests.map((guest) => (
                        <Item style={{ position: 'relative' }} key={guest.userID}>
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
                                    <Link to={`/profiles/${guest.username}`}>{guest.fullname}</Link>
                                </Item.Header>
                                <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}

                </List>
            </Segment>
        </Fragment>
    )
}

export default observer(EventDetailGuestList)