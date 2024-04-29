import { Card, Container, Grid, Header, Tab } from "semantic-ui-react"
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
                        {followings.length > 0 ? followings.map((profile) => (
                            <ProfileCard key={profile.userID} userProfile={profile} />
                        )) : (
                            <Container textAlign="center">
                                <Header
                                    as='h2'
                                    content={activeTab === 3 ? 'This person follows no one'
                                        : activeTab === 2 ? 'This person has no followers' : null}
                                    style={{ marginTop: 15 }} />
                            </Container>
                        )}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileFollowings)