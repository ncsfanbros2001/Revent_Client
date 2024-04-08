import { makeAutoObservable, runInAction } from "mobx";
import { EventsModel } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";
import { v4 as uuid } from "uuid"
import { format } from "date-fns";

export default class EventStore {
    eventListRegistry = new Map<string, EventsModel>(); //<key: id of an event, value: the event itself>
    selectedEvent: EventsModel | undefined = undefined;
    loading = false;
    loadingInitial = false

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }


    setSelectedEvent = (event: EventsModel | undefined) => {
        this.selectedEvent = event
    }


    get eventsByDate() { // Sort event by date asc
        return Array.from(this.eventListRegistry.values())
            .sort((a, b) => a.beginTime!.getTime() - b.beginTime!.getTime())
    }

    get groupedEvents() {
        return Object.entries(
            this.eventsByDate.reduce((eventList, event) => {
                const date = format(event.beginTime!, 'dd MMM yyyy')
                eventList[date] = eventList[date] ? [...eventList[date], event] : [event]
                return eventList
            }, {} as { [key: string]: EventsModel[] })
        )
    }


    private getEvent = (eventID: string) => {
        return this.eventListRegistry.get(eventID)
    }


    private setEvent = (event: EventsModel) => {
        event.beginTime = new Date(event.beginTime!);
        event.endTime = new Date(event.endTime!);
        event.attendDeadline = new Date(event.attendDeadline!);

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


    createEvent = async (event: EventsModel) => {
        this.setLoadingInitial(true)

        try {
            event.eventID = uuid();
            event.status = 'not yet started'
            event.createdTime = new Date()
            event.updatedAt = new Date()

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


    updateEvent = async (event: EventsModel) => {
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