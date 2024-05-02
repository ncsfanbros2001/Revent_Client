import { Button, Reveal } from "semantic-ui-react"
import { Profile } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"
import { useStore } from "../../Stores/store"
import { SyntheticEvent } from "react"
import { Roles } from "../../Utilities/staticValues"

interface Props {
    profile: Profile
}

const FollowButton = ({ profile }: Props) => {
    const { profileStore, userStore } = useStore()
    const { updateFollowing, loadingUpdateFollowing } = profileStore

    const handleFollow = (e: SyntheticEvent, userID: string) => {
        e.preventDefault()

        profile.following ? updateFollowing(userID, false) : updateFollowing(userID, true)
    }

    if (userStore.currentUser?.userID === profile.userID
        || userStore.currentUser?.role === Roles.Admin
        || profile.role === Roles.Admin)
        return null
    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    fluid
                    loading={loadingUpdateFollowing}
                    disabled={loadingUpdateFollowing}
                    color={profile.following ? "teal" : "orange"}
                    content={profile.following ? "Following" : "Not Following"} />
            </Reveal.Content>

            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    color={profile.following ? "red" : "green"}
                    content={profile.following ? "Unfollow" : "Follow"}
                    loading={loadingUpdateFollowing}
                    disabled={loadingUpdateFollowing}
                    onClick={(e) => handleFollow(e, profile.userID)} />
            </Reveal.Content>
        </Reveal>
    )
}

export default observer(FollowButton)