import { observer } from "mobx-react-lite"
import { GuestProfile } from "../../Interfaces/user"
import { Card, Icon, Image } from "semantic-ui-react"
import { Link } from "react-router-dom"

interface Props {
    userProfile: GuestProfile
}

const ProfileCard = ({ userProfile }: Props) => {
    return (
        <Card as={Link} to={`/profiles/${userProfile.username}`}>
            <Image src={userProfile.avatar || '../../../public/user.png'} />
            <Card.Content>
                <Card.Header>{userProfile.fullname}</Card.Header>
                <Card.Description>{userProfile.username}</Card.Description>
            </Card.Content>
            <Card.Content>
                <Icon name="user" /> 20 followers
            </Card.Content>
        </Card>
    )
}

export default observer(ProfileCard)