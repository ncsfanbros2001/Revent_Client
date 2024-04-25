import { Button, Checkbox, Container, Divider, Grid, Header, List, Message, Segment, Tab } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import UpdateProfileForm from "../Form/UpdateProfileForm"
import { format } from "date-fns"
import { IProfile } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"
import { Fragment } from "react/jsx-runtime"
import { Visibility } from "../../Utilities/staticValues"
import ChangePasswordForm from "../Form/ChangePasswordForm"

interface Props {
    userProfile: IProfile
}

const ProfileAbout = ({ userProfile }: Props) => {
    const { modalStore, userStore } = useStore()
    const { checkLastUpdate, nextUpdateDate, updateProfileVisibility } = userStore

    return (
        <Tab.Pane>
            <Header as='h3' content={"About " + userProfile?.fullname} icon='info circle' />

            {
                userProfile.profileVisibility === Visibility.Private && userProfile.userID !== userStore.currentUser?.userID ?
                    (
                        <Message
                            negative
                            icon='lock'
                            header='Privatized'
                            content='This user has privatized their info...' />
                    ) : (
                        <Fragment>
                            <Container>
                                <List size="large" style={{ paddingLeft: 20 }}>
                                    <List.Item icon='intergender'
                                        content={'Gender: ' + userProfile.gender.charAt(0).toUpperCase()
                                            + userProfile.gender.slice(1)} />
                                    <List.Item icon='mail' content={'Email: ' + userProfile.email} />
                                    <List.Item icon='phone' content={'Phone Number: ' + userProfile.phoneNumber} />
                                    <List.Item icon='marker' content={'Address: ' + userProfile.address} />
                                    <List.Item icon='birthday cake' content={'Birthday: '
                                        + format(userProfile.birthDate!, "dd/MM/yyy")} />
                                </List>
                            </Container>

                            <Segment>
                                <Header as='h2' content='Biography' />
                                <p>{userProfile.biography}</p>
                            </Segment>
                        </Fragment>
                    )
            }

            {
                userProfile.userID === userStore.currentUser?.userID &&
                (
                    <Fragment>
                        <Divider />
                        <Grid>
                            <Grid.Row verticalAlign="middle">
                                <Grid.Column width={11} floated="left">
                                    <Button
                                        icon='user circle'
                                        disabled={checkLastUpdate}
                                        content={!checkLastUpdate ? 'Manage Profile'
                                            : `You can update again on ${format(nextUpdateDate, "dd/MM/yyyy")}`}
                                        color="blue"
                                        onClick={() => modalStore.openModal(<UpdateProfileForm />)} />
                                    <Button
                                        icon='edit'
                                        content='Change Password'
                                        color='teal'
                                        onClick={() => modalStore.openModal(<ChangePasswordForm />)} />
                                </Grid.Column>

                                <Grid.Column width={5} floated="right">
                                    <Checkbox
                                        toggle
                                        label={'Publicity Mode: ' + userProfile.profileVisibility}
                                        defaultChecked={userProfile.profileVisibility === Visibility.Public}
                                        onChange={() => updateProfileVisibility()} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Fragment>
                )
            }
        </Tab.Pane>
    )
}

export default observer(ProfileAbout)