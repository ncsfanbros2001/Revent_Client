import { useStore } from "../../Stores/store"
import { observer } from "mobx-react-lite"
import EventListItem from "./EventListItem"
import { Fragment } from "react"
import { EventStatus } from "../../Utilities/staticValues"

const EventList = () => {
    const { eventStore } = useStore();
    const { eventToList } = eventStore

    return (
        <Fragment>
            {eventToList.filter(x => x.status !== EventStatus.Suspended).map((event) => (
                <EventListItem event={event} key={event.eventID} />
            ))}
        </Fragment>
    )
}

export default observer(EventList)