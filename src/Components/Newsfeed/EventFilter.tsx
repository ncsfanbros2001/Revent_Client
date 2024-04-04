import Calendar from "react-calendar"
import { Header, Menu } from "semantic-ui-react"

const EventFilter = () => {
    return (
        <>
            <Menu vertical size="large" style={{ width: '100%', marginTop: 28 }}>
                <Header icon='filter' attached color="teal" content='Filters' />
                <Menu.Item content='All Events' />
                <Menu.Item content='Attending' />
                <Menu.Item content='Hosting' />
            </Menu>

            <Header />
            <Calendar />
        </>
    )
}

export default EventFilter