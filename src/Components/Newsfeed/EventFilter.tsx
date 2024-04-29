import { observer } from "mobx-react-lite"
import Calendar from "react-calendar"
import { Header, Menu } from "semantic-ui-react"
import { useStore } from "../../Stores/store"

const EventFilter = () => {
    const { eventStore } = useStore()
    const { predicate, setPredicate } = eventStore

    return (
        <>
            <Menu vertical size="large" style={{ width: '100%', marginTop: 20 }}>
                <Header icon='filter' attached color="teal" content='Filters' />
                <Menu.Item
                    content='All Events'
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all', 'true')} />
                <Menu.Item
                    content='Attending'
                    active={predicate.has('isGoing')}
                    onClick={() => setPredicate('isGoing', 'true')} />
                <Menu.Item content='Hosting'
                    active={predicate.has('isHost')}
                    onClick={() => setPredicate('isHost', 'true')} />
            </Menu>

            <Header />
            <Calendar
                onChange={(date) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()} />
        </>
    )
}

export default observer(EventFilter)