import { makeAutoObservable, runInAction } from "mobx";
import { Events } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";
import { v4 as uuid } from "uuid"

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

    get groupedEvents() {
        return Object.entries(
            this.eventsByDate.reduce((eventList, event) => {
                const date = event.beginTime
                eventList[date] = eventList[date] ? [...eventList[date], event] : [event]
                return eventList
            }, {} as { [key: string]: Events[] })
        )
    }


    private getEvent = (eventID: string) => {
        return this.eventListRegistry.get(eventID)
    }


    private setEvent = (event: Events) => {
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
                this.setEvent(event)
            });
        }
        catch (error) {
            console.log(error)
        }
        finally {
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
                this.setEvent(event)
                this.setSelectedEvent(event)
            } catch (error) {
                console.log(error);
            }
            finally {
                this.setLoadingInitial(false)
            }
        }
    }


    createEvent = async (event: Events) => {
        this.setLoadingInitial(true)

        try {
            event.eventID = uuid();
            event.createdTime = undefined
            event.updatedAt = undefined

            await axiosAgent.EventActions.createEvent(event)

            runInAction(() => {
                this.setEvent(event)
            })
        }
        catch (error) {
            console.log("Create event failed", error)
        }
        finally {
            this.setLoadingInitial(false)
        }
    }


    updateEvent = async (event: Events) => {
        this.setLoadingInitial(true)

        try {
            await axiosAgent.EventActions.updateEvent(event)

            runInAction(() => {
                this.setEvent(event)
                this.setSelectedEvent(event)
            })
        }
        catch (error) {
            console.log("Update event failed", error)
        }
        finally {
            this.setLoadingInitial(false)
        }
    }


    deleteEvent = async (eventID: string) => {
        this.loading = true

        try {
            await axiosAgent.EventActions.deleteEvent(eventID)

            runInAction(() => {
                this.eventListRegistry.delete(eventID)
            })
        }
        catch (error) {
            console.log("Delete event failed", error)
        }
        finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

}