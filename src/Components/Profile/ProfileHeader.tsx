import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react"
import { Profile } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import AvatarCard from "./AvatarCard"

interface Props {
    userProfile: Profile
}

const ProfileHeader = ({ userProfile }: Props) => {
    const { modalStore } = useStore()

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item.Group>
                            <Item>
                                <Item.Image
                                    avatar
                                    size="small"
                                    src={userProfile.avatarURL || '/public/user.png'}
                                    onClick={() => (
                                        modalStore.openModal(<AvatarCard userProfile={userProfile} />)
                                    )} />

                                <Item.Content verticalAlign="middle">
                                    <Header as='h1' content={userProfile.fullname} />
                                    <p style={{ color: 'gray' }}>@{userProfile.username}</p>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Item.Group>
                </Grid.Column>

                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value='5' />
                        <Statistic label='Following' value='27' />
                    </Statistic.Group>

                    <Divider />

                    <Reveal animated="move">
                        <Reveal.Content visible style={{ width: '100%' }}>
                            <Button fluid color="teal" content="Following" />
                        </Reveal.Content>

                        <Reveal.Content hidden style={{ width: '100%' }}>
                            <Button fluid basic color={true ? "red" : "green"} content={true ? "Unfollow" : "Follow"} />
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
}

export default observer(ProfileHeader)