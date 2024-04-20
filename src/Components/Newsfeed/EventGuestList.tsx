import { observer } from "mobx-react-lite"
import { List, Image, Popup } from "semantic-ui-react"
import { Profile } from "../../Interfaces/user"
import { Link } from "react-router-dom"
import ProfileCard from "../Profile/ProfileCard"

interface Props {
    guests: Profile[]
}

const EventGuestList = ({ guests }: Props) => {
    const styles = {
        borderColor: 'orange',
        borderWidth: 2
    }

    return (
        <List horizontal>
            {guests.map((guest) => (
                <Popup
                    size="small"
                    position="right center"
                    hoverable
                    key={guest.userID}
                    trigger={
                        <List.Item key={guest.userID} as={Link} to={`/profiles/${guest.userID}`}>
                            <Image
                                style={guest.following ? styles : null}
                                size='mini'
                                circular
                                src={guest.avatarURL || '/public/user.png'} />
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