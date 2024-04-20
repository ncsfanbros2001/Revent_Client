import { Card, Grid, Header, Tab } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import ProfileCard from "./ProfileCard"
import { useEffect } from "react"

const ProfileFollowings = () => {
    const { profileStore } = useStore()
    const { profile, followings, loadFollowings, loadingFollowings } = profileStore

    useEffect(() => {
        loadFollowings('followings')
    }, [loadFollowings])

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon={'user'} content={`People following ${profile?.fullname}`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {followings.map((profile) => (
                            <ProfileCard key={profile.username} userProfile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileFollowings