import { makeAutoObservable, runInAction } from "mobx";
import { Events } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";

export default class EventStore {
    eventListRegistry = new Map<string, Events>(); //<key: id of an event, value: the event itself>
    selectedEvent: Events | undefined = undefined;
    loading = false;
    loadingInitial = true

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }


    setSelectedEvent = (event: Events | undefined) => {
        this.selectedEvent = event
    }


    get eventsByDate() { // Sort event by date asc
        return Array.from(this.eventListRegistry.values())
            .sort((a, b) => Date.parse(a.beginTime) - Date.parse(b.beginTime))
    }


    private getEvent = (eventID: string) => {
        return this.eventListRegistry.get(eventID)
    }


    private setActivity = (event: Events) => {
        event.beginTime = event.beginTime.split('T')[0];
        event.endTime = event.endTime.split('T')[0];
        event.attendDeadline = event.attendDeadline.split('T')[0];

        runInAction(() => {
            this.eventListRegistry.set(event.eventID, event)
        })
    }


    loadAllEvents = async () => {
        this.setLoadingInitial(true)
        try {
            const events = await axiosAgent.EventActions.getAllEvents()

            events.forEach((event) => {
                this.setActivity(event)
            });

            this.setLoadingInitial(false)
        }
        catch (error) {
            console.log(error)
            this.setLoadingInitial(false)
        }
    }


    loadOneEvent = async (eventID: string) => {
        let event = this.getEvent(eventID)
        if (event) { // If event is available inside the registry, set selected event to it
            this.setSelectedEvent(event)
        }
        else { // If event isn't available inside the registry, get it from DB, add it to the registry and assign it as selected event
            this.setLoadingInitial(true)
            try {
                event = await axiosAgent.EventActions.getOneEvent(eventID)
                this.setActivity(event)
                this.setSelectedEvent(event)

                this.setLoadingInitial(false)
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false)
            }
        }
    }


    createEvent = async (event: Events) => {
        this.setLoadingInitial(true)
        this.loading = true

        try {
            await axiosAgent.EventActions.createEvent(event)

            runInAction(() => {
                this.eventListRegistry.set(event.eventID, event)
                this.setSelectedEvent(event)

                this.loading = false
                this.setLoadingInitial(false)
            })
        }
        catch (error) {
            console.log("Create event failed", error)
            runInAction(() => {
                this.loading = false
                this.setLoadingInitial(false)
            })
        }
    }


    updateEvent = async (event: Events) => {
        this.setLoadingInitial(true)
        this.loading = true

        try {
            await axiosAgent.EventActions.updateEvent(event)

            runInAction(() => {
                this.eventListRegistry.set(event.eventID, event)
                this.setSelectedEvent(event)

                this.loading = false
                this.setLoadingInitial(false)
            })
        }
        catch (error) {
            console.log("Update event failed", error)
            runInAction(() => {
                this.loading = false
                this.setLoadingInitial(false)
            })
        }
    }


    deleteEvent = async (eventID: string) => {
        this.loading = true

        try {
            await axiosAgent.EventActions.deleteEvent(eventID)

            runInAction(() => {
                this.eventListRegistry.delete(eventID)
                this.loading = false
            })
        }
        catch (error) {
            console.log("Delete event failed", error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

}