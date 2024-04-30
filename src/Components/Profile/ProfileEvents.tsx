import { Divider, Header, Tab, Table } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import UserEvents from "./UserEvents"

const ProfileEvents = () => {
    const { userStore, profileStore } = useStore()
    const { eventStatistics, loading } = profileStore


    return (
        <Tab.Pane loading={loading}>
            <Header as='h3' content={userStore.currentUser?.fullname + " Events Stats"} icon='chart bar' />

            <Table celled>
                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell>Total Event Hosted</Table.HeaderCell>
                        <Table.HeaderCell>Total Guest Attended</Table.HeaderCell>
                        <Table.HeaderCell>Total Care Received</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row textAlign="center">
                        <Table.Cell>{eventStatistics!.totalEventHosted}</Table.Cell>
                        <Table.Cell>{eventStatistics!.totalGuestsAttended}</Table.Cell>
                        <Table.Cell>{eventStatistics!.totalCaresReceived}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <Divider />

            <UserEvents />
        </Tab.Pane>
    )
}

export default observer(ProfileEvents)