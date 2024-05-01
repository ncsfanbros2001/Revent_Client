import { Tab } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import ProfileFollowings from "./ProfileFollowings"
import { useStore } from "../../Stores/store"
import ProfileAbout from "./ProfileAbout"
import { IProfile } from "../../Interfaces/user"
import ProfileEvents from "./ProfileEvents"
import { useEffect } from "react"

interface Props {
    userProfile: IProfile
}

const ProfileContent = ({ userProfile }: Props) => {
    const { profileStore } = useStore()

    useEffect(() => { profileStore.getEventStatistics(profileStore.profile!.userID) }, [])

    const profileTabs = [
        { menuItem: "About", render: () => <ProfileAbout userProfile={userProfile} /> },
        { menuItem: "Events", render: () => <ProfileEvents /> },
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