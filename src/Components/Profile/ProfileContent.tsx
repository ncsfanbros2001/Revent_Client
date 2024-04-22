import { Tab } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import ProfileFollowings from "./ProfileFollowings"
import { useStore } from "../../Stores/store"

const ProfileContent = () => {
    const { profileStore } = useStore()

    const profileTabs = [
        { menuItem: "About", render: () => <Tab.Pane>About</Tab.Pane> },
        { menuItem: "Events", render: () => <Tab.Pane>Events</Tab.Pane> },
        { menuItem: "Followers", render: () => <ProfileFollowings /> },
        { menuItem: "Following", render: () => <ProfileFollowings /> }
    ]

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition="left"
            panes={profileTabs}
            onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)} />
    )
}

export default observer(ProfileContent)