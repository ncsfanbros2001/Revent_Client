import { observer } from "mobx-react-lite"
import { List, Image, Popup } from "semantic-ui-react"
import { GuestProfile } from "../../Interfaces/user"
import { Link } from "react-router-dom"
import ProfileCard from "../Profile/ProfileCard"

interface Props {
    guests: GuestProfile[]
}

const EventGuestList = ({ guests }: Props) => {
    return (
        <List horizontal>
            {guests.map((guest) => (
                <Popup
                    hoverable
                    key={guest.userID}
                    trigger={
                        <List.Item key={guest.userID} as={Link} to={`/profiles/${guest.username}`}>
                            <Image size='mini' circular src={guest.avatar || '../../../public/user.png'} />
                        </List.Item>
                    }>
                    <Popup.Content>
                        <ProfileCard userProfile={guest} />
                    </Popup.Content>
                </Popup>

            ))}
        </List>
    )
}

export default observer(EventGuestList)   