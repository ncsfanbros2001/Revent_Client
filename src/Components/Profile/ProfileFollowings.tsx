import { Card, Grid, Header, Tab } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import ProfileCard from "./ProfileCard"
import { observer } from "mobx-react-lite"

const ProfileFollowings = () => {
    const { profileStore } = useStore()
    const { profile, followings, loadingFollowings, activeTab } = profileStore


    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated="left"
                        icon={'user'}
                        content={activeTab === 2 ?
                            `People following ${profile?.fullname}` : `People ${profile?.fullname} following`} />
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

export default observer(ProfileFollowings)