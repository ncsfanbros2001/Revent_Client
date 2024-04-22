import { observer } from "mobx-react-lite"
import { Button, Grid, Item, Segment } from "semantic-ui-react"
import { Profile } from "../../Interfaces/user"
import { useStore } from "../../Stores/store"
import { useState } from "react"
import PhotoUploadWidget from "../ImageHandler/PhotoUploadWidget"

interface Props {
    userProfile: Profile
}

const AvatarCard = ({ userProfile }: Props) => {
    const { modalStore, profileStore } = useStore()
    const [changeAvatarMode, setChangeAvatarMode] = useState(false)

    const handlePhotoUpload = (file: Blob) => {
        profileStore.changeAvatar(file).then(() => {
            setChangeAvatarMode(false)
            modalStore.closeModal()
        })
    }

    return (
        <Segment>
            <Grid verticalAlign="middle" columns={16} centered>
                <Grid.Row columns={16}>
                    {changeAvatarMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={profileStore.uploading} />
                    ) : (
                        <Item.Image size='large' src={userProfile.avatarURL || '/public/user.png'} rounded />
                    )}
                </Grid.Row>

                <Grid.Row columns={16}>
                    {profileStore.isCurrentUser && (
                        <Button
                            disabled={profileStore.uploading}
                            content={changeAvatarMode ? 'Cancel' : 'Change Avatar'}
                            color={changeAvatarMode ? 'orange' : 'blue'}
                            onClick={() => setChangeAvatarMode(!changeAvatarMode)}
                            size="large" />
                    )}

                    <Button
                        disabled={profileStore.uploading}
                        content='Exit'
                        color="red"
                        onClick={() => modalStore.closeModal()}
                        size="large" />
                </Grid.Row>
            </Grid>
        </Segment>
    )
}

export default observer(AvatarCard)