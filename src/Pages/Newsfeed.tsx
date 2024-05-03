import "semantic-ui-css/semantic.min.css";
import { Button, Container, Grid, Header, Loader, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import EventList from "../Components/Newsfeed/EventList";
import { useStore } from "../Stores/store";
import { observer } from "mobx-react-lite";
import EventFilter from "../Components/Newsfeed/EventFilter";
import { PagingParams } from "../Interfaces/pagination";
import InfiniteScroll from "react-infinite-scroller";
import EventItemPlaceholder from "../Components/Newsfeed/EventItemPlaceholder";
import { Roles } from "../Utilities/staticValues";
import ReportList from "../Components/Admin/ReportList";

const Newsfeed = () => {
    const { eventStore, profileStore, userStore } = useStore()
    const { loadAllEvents, loadingInitial, clearSelectedEvent, selectedEvent, setPagingParams, pagination,
        eventListRegistry } = eventStore
    const { profile, clearUserProfile } = profileStore
    const [loadingNext, setLoadingNext] = useState(false)

    const handleGetNext = () => {
        setLoadingNext(true)
        setPagingParams(new PagingParams(pagination!.currentPage + 1))

        loadAllEvents().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        if (selectedEvent) {
            clearSelectedEvent()
        }
        if (profile) {
            clearUserProfile()
        }

        if (userStore.currentUser?.role !== Roles.Admin) {
            loadAllEvents().then(() => setLoadingNext(false))
        }
    }, []);

    return (
        <Grid>
            {userStore.currentUser!.role === Roles.User ? (
                <>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {loadingInitial && !loadingNext && eventListRegistry.size === 0 ? (
                                <>
                                    <EventItemPlaceholder />
                                    <EventItemPlaceholder />
                                </>
                            ) : !loadingInitial && !loadingNext && eventListRegistry.size === 0 ? (
                                <Container textAlign="center" style={{ marginTop: 20 }}>
                                    <Header as='h1' content='Oops ...! There is no event to display' />
                                    <Button content='Try Refresh' color="blue" icon='redo' onClick={() => loadAllEvents()} />
                                </Container>
                            ) : (
                                <InfiniteScroll
                                    pageStart={0}
                                    loadMore={handleGetNext}
                                    hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                                    initialLoad={false}
                                >
                                    <EventList />
                                </InfiniteScroll>
                            )}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <EventFilter />
                        </Grid.Column>
                    </Grid.Row>

                    {loadingNext && (
                        <Grid.Column width={10}>
                            <Segment>
                                <Loader active={loadingNext} size="tiny" />
                            </Segment>
                        </Grid.Column>
                    )}
                </>
            ) : (
                <ReportList />
            )}
        </Grid >
    );
};

export default observer(Newsfeed);
