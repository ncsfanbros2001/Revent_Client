import { observer } from "mobx-react-lite"
import { Profile } from "../../Interfaces/user"
import { Card, Icon, Image } from "semantic-ui-react"
import { Link } from "react-router-dom"
import FollowButton from "./FollowButton"

interface Props {
    userProfile: Profile
}

const ProfileCard = ({ userProfile }: Props) => {
    return (
        <Card as={Link} to={`/profiles/${userProfile.userID}`}>
            <Image src={userProfile.avatarURL || '/public/user.png'} />

            <Card.Content>
                <Card.Header>{userProfile.fullname}</Card.Header>
                <Card.Description>{userProfile.username}</Card.Description>
            </Card.Content>

            <Card.Content>
                <Icon name="user" /> {userProfile.followersCount} followers
            </Card.Content>

            <FollowButton profile={userProfile} />
        </Card>
    )
}

export default observer(ProfileCard)