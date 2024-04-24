import { Tab } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import ProfileFollowings from "./ProfileFollowings"
import { useStore } from "../../Stores/store"
import ProfileAbout from "./ProfileAbout"
import { IProfile } from "../../Interfaces/user"

interface Props {
    userProfile: IProfile
}

const ProfileContent = ({ userProfile }: Props) => {
    const { profileStore } = useStore()

    const profileTabs = [
        { menuItem: "About", render: () => <ProfileAbout userProfile={userProfile} /> },
        { menuItem: "Events", render: () => <Tab.Pane>Events</Tab.Pane> },
        { menuItem: "Followers", render: () => <ProfileFollowings /> },
        { menuItem: "Following", render: () => <ProfileFollowings /> },
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