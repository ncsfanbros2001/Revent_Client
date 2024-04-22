import "semantic-ui-css/semantic.min.css";
import { Grid, Loader } from "semantic-ui-react";
import { useEffect, useState } from "react";
import EventList from "../Components/Newsfeed/EventList";
import { useStore } from "../Stores/store";
import { observer } from "mobx-react-lite";
import EventFilter from "../Components/Newsfeed/EventFilter";
import { PagingParams } from "../Interfaces/pagination";
import InfiniteScroll from "react-infinite-scroller";
import EventItemPlaceholder from "../Components/Newsfeed/EventItemPlaceholder";

const Newsfeed = () => {
    const { eventStore } = useStore()
    const { loadAllEvents, loadingInitial, clearSelectedEvent, selectedEvent, setPagingParams, pagination,
        eventListRegistry } = eventStore
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
        loadAllEvents()
    }, [eventStore]);

    return (
        <Grid>
            <Grid.Column width={10}>
                {loadingInitial && !loadingNext && eventListRegistry.size === 0 ? (
                    <>
                        <EventItemPlaceholder />
                        <EventItemPlaceholder />
                    </>
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

            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(Newsfeed);
