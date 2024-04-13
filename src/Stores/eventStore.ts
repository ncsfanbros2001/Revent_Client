import { makeAutoObservable, runInAction } from "mobx";
import { EventsModel, UpsertEventsModel } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";
import { format } from "date-fns";
import { v4 as uuid } from 'uuid'
import { store } from "./store";
import { Profile } from "../Interfaces/user";
import { EventStatus } from "../Utilities/staticValues";

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

        const user = store.userStore.currentUser
        if (user) { // check if the logged in user is going to the event or not
            event.isGoing = event.guests!.some(a => a.userID.toLowerCase() === user.userID.toLowerCase())
            event.isHost = event.hostUserID.toLowerCase() === user.userID.toLowerCase()
            event.host = event.guests?.find(x => x.userID.toLowerCase() === event.hostUserID.toLowerCase())
        }

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


    createEvent = async (event: UpsertEventsModel) => {
        this.setLoadingInitial(true)

        const user = store.userStore.currentUser
        const guests = new Profile(user!)

        try {
            event.eventToUpsert.eventID = uuid();
            event.eventToUpsert.status = EventStatus.NotYetStarted
            event.eventToUpsert.createdTime = new Date();
            event.eventToUpsert.updatedAt = new Date()

            await axiosAgent.EventActions.createEvent(event)
            let newEvent = new EventsModel(event.eventToUpsert)

            newEvent.hostUserID = user!.userID
            newEvent.guests = [guests]
            newEvent.isGoing = true
            newEvent.isHost = true

            console.log(newEvent)

            this.setEvent(newEvent)
            this.setSelectedEvent(newEvent)
        }
        catch (error) {
            console.log("Create event failed", error)
        }
        finally {
            this.setLoadingInitial(false)
        }
    }


    updateEvent = async (event: UpsertEventsModel) => {
        this.setLoadingInitial(true)

        try {
            await axiosAgent.EventActions.updateEvent(event)

            runInAction(() => {
                if (event.eventToUpsert.eventID) {
                    const updatedActivity = { ...this.getEvent(event.eventToUpsert.eventID), ...event.eventToUpsert }
                    this.setEvent(updatedActivity as EventsModel)
                    this.setSelectedEvent(updatedActivity as EventsModel)
                }
            })
        }
        catch (error) {
            console.log("Update event failed", error)
        }
        finally {
            this.setLoadingInitial(false)
        }
    }


    deleteEvent = async (eventID: string, userID: string) => {
        this.loading = true

        try {
            await axiosAgent.EventActions.deleteEvent(eventID, userID)

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

    updateAttendance = async () => {
        this.loading = true
        const user = store.userStore.currentUser

        try {
            await axiosAgent.EventActions.attendEvent(this.selectedEvent!.eventID, user!.userID)
            runInAction(() => {
                if (this.selectedEvent?.isGoing) {
                    this.selectedEvent.guests = this.selectedEvent.guests
                        .filter(x => x.userID !== user?.userID)
                    this.selectedEvent.isGoing = false
                }
                else {
                    const guest = new Profile(user!)
                    this.selectedEvent!.guests.push(guest)
                    this.selectedEvent!.isGoing = true
                }
                this.eventListRegistry.set(this.selectedEvent!.eventID, this.selectedEvent!)
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loading = false)
        }
    }

    cancelEvent = async () => {
        this.loading = true
        const user = store.userStore.currentUser

        try {
            await axiosAgent.EventActions.attendEvent(this.selectedEvent!.eventID, user!.userID)
            runInAction(() => this.selectedEvent!.status = EventStatus.Cancelled)

            this.setEvent(this.selectedEvent!)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loading = false)
        }
    }

}