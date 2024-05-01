import { observer } from "mobx-react-lite"
import { Fragment } from "react/jsx-runtime"
import { Button, Container, Header, List, Segment } from "semantic-ui-react"
import { useStore } from "../Stores/store"
import { NotificationStatus } from "../Utilities/staticValues"
import { formatDistanceToNow } from "date-fns"
import { useEffect } from "react"

const Notifications = () => {
    const { userStore, notiicationStore } = useStore()
    const { toggleNotificationStatus, loading, loadingNotifications, notificationList, getNotifications } = notiicationStore
    const { currentUser } = userStore

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <Fragment>
            <Segment clearing>
                <Container>
                    <Header as='h1' content='Notifications' color="blue" />
                    <Button
                        loading={loadingNotifications}
                        disabled={loading || loadingNotifications}
                        onClick={() => getNotifications()}
                        color={'blue'}
                        content={loading ? "Refreshing ..." : "Refresh"}
                        icon={'redo'} />

                    <Button
                        loading={loading}
                        disabled={loading || loadingNotifications}
                        floated="right"
                        onClick={() => toggleNotificationStatus()}
                        color={currentUser?.notificationStatus === NotificationStatus.Disabled ? "orange" : "green"}
                        content={currentUser?.notificationStatus === NotificationStatus.Disabled ?
                            "Notifications Off" : "Notifications On"}
                        icon={currentUser?.notificationStatus === NotificationStatus.Disabled ? 'toggle off' : 'toggle on'} />
                </Container>


                <Segment loading={loadingNotifications} style={{ maxHeight: 500, overflowY: 'auto' }}>
                    <List divided relaxed verticalAlign="middle" size="large" >
                        {notificationList.length > 0 && !loadingNotifications ? notificationList.map((item) => (
                            <List.Item key={item.notificationID}>
                                <List.Content>
                                    <List.Header as='h3'>{item.content}</List.Header>
                                    <List.Description as='p'>{formatDistanceToNow(item.createdTime)} ago</List.Description>
                                </List.Content>
                            </List.Item>
                        )) : notificationList.length === 0 && !loadingNotifications ? (
                            <Header as='h1' content='You dont have any notification yet' textAlign="center" />
                        ) : (
                            <Header as='h1' content='Loading' textAlign="center" />
                        )}
                    </List>
                </Segment>
            </Segment>
        </Fragment >
    )
}

export default observer(Notifications)