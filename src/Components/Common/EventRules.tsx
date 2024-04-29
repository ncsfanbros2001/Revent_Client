import { Fragment, useState } from "react"
import { Accordion, Button, Header, Icon, Segment } from "semantic-ui-react"
import { useStore } from "../../Stores/store"
import EventForm from "../Form/EventForm"
import { EventsModel } from "../../Interfaces/event"

interface Props {
    selectedEvent?: EventsModel
}

const EventRules = ({ selectedEvent }: Props) => {
    const { modalStore } = useStore()
    const [activeIndex, setActiveIndex] = useState(9)

    return (
        <Fragment>
            <Segment clearing>
                <Header as='h1' content="Rules" color="blue" textAlign="center" />
                <Accordion fluid styled>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={() => setActiveIndex(0)}
                    >
                        <Icon name='dropdown' />
                        <b>Inappropriate Word</b>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            Users are strictly prohibited from posting content and speech that incite hatred,
                            harassment, violence and illegal activities.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={() => setActiveIndex(1)}
                    >
                        <Icon name='dropdown' />
                        <b>False Information</b>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <p>
                            Users must ensure that the event's descriptions are accurate and continuously update information whenever
                            there's an update, avoiding giving users false information, spam or inappropriate content. other case.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={() => setActiveIndex(2)}
                    >
                        <Icon name='dropdown' />
                        <b>Respect Others Privacy</b>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <p>
                            Users are required to respect the privacy of event attendees and are not allowed
                            to share sensitive personal information without the attendees' consent.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 3}
                        index={1}
                        onClick={() => setActiveIndex(3)}
                    >
                        <Icon name='dropdown' />
                        <b>Be Legal</b>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <p>
                            Users must ensure that their event covers applicable laws and regulations, prohibiting illegal activities,
                            copyright infringement or unauthorized use of trademarks.
                        </p>
                    </Accordion.Content>
                </Accordion>

                {selectedEvent ? (
                    <Button fluid primary content="I Understand" style={{ marginTop: 15 }}
                        onClick={() => modalStore.openModal(<EventForm selectedEvent={selectedEvent} />)} />
                ) : (
                    <Button fluid primary content="I Understand" style={{ marginTop: 15 }}
                        onClick={() => modalStore.openModal(<EventForm />)} />
                )}
            </Segment>


        </Fragment>
    )
}

export default EventRules