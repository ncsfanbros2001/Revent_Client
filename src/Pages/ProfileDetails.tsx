import { Grid } from "semantic-ui-react"
import ProfileHeader from "../Components/Profile/ProfileHeader"
import ProfileContent from "../Components/Profile/ProfileContent"
import { observer } from "mobx-react-lite"
import { useParams } from "react-router-dom"
import { useStore } from "../Stores/store"
import { useEffect } from "react"
import LoadingComponent from "../Components/Common/LoadingComponent"

const ProfileDetails = () => {
    const { username } = useParams()
    const { userStore } = useStore()
    const { loadProfile, loadingProfile, profile } = userStore

    useEffect(() => {
        if (username) {
            loadProfile(username)
        }
    }, [loadProfile, username])

    if (loadingProfile) return <LoadingComponent content="Loading profile..." />
    return (
        <Grid>
            <Grid.Column width={16}>
                {profile && (
                    <>
                        <ProfileHeader userProfile={profile} />
                        <ProfileContent userProfile={profile} />
                    </>
                )}
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfileDetails)