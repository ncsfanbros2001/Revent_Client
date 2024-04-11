import { Header } from "semantic-ui-react"
import { EventsModel } from "../../Interfaces/event"
import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import EventListItem from "./EventListItem"
import { Fragment } from "react"

const EventList = () => {
    const { eventStore } = useStore();
    const { groupedEvents } = eventStore

    return (
        <Fragment>
            <>
                {groupedEvents.map(([group, events]) => (
                    <Fragment key={group}>
                        <Header sub color="teal">{group}</Header>
                        {events.map((event: EventsModel) => (
                            <EventListItem event={event} key={event.eventID} />
                        ))}
                    </Fragment>
                ))}
            </>

        </Fragment>
    )
}

export default observer(EventList)