import { Tab } from "semantic-ui-react"
import { Profile } from "../../Interfaces/user"
import { observer } from "mobx-react-lite"

interface Props {
    userProfile: Profile
}

const ProfileContent = ({ props }: Props) => {
    const profileTabs = [
        { menuItem: "About", render: () => <Tab.Pane>About</Tab.Pane> },
        { menuItem: "Events", render: () => <Tab.Pane>Events</Tab.Pane> },
        { menuItem: "Followers", render: () => <Tab.Pane>Followers</Tab.Pane> },
        { menuItem: "Following", render: () => <Tab.Pane>Following</Tab.Pane> }
    ]

    return (
        <Tab menu={{ fluid: true, vertical: true }} menuPosition="left" panes={profileTabs} />
    )
}

export default observer(ProfileContent)