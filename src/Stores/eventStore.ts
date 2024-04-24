import { makeAutoObservable, reaction, runInAction } from "mobx";
import { EventFormValues, EventsModel } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";
import { format } from "date-fns";
import { v4 as uuid } from 'uuid'
import { store } from "./store";
import { EventStatus } from "../Utilities/staticValues";
import { Pagination, PagingParams } from "../Interfaces/pagination";
import { Profile } from "../Interfaces/user";

export default class EventStore {
    eventListRegistry = new Map<string, EventsModel>() //<key: id of an event, value: the event itself>
    selectedEvent: EventsModel | undefined = undefined
    loading = false
    loadingInitial = false
    pagination: Pagination | null = null
    pagingParams = new PagingParams()
    predicate = new Map().set('all', true)

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => { // Reset paging when user is changing filtering criteria
                this.pagingParams = new PagingParams()
                this.eventListRegistry.clear()
                this.loadAllEvents()
            }
        )
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'startDate') {
                    this.predicate.delete(key)
                }
            })
        }

        switch (predicate) {
            case "all":
                resetPredicate()
                this.predicate.set('all', true)
                break
            case "isGoing":
                resetPredicate()
                this.predicate.set('isGoing', true)
                break
            case "isHost":
                resetPredicate()
                this.predicate.set('isHost', true)
                break
            case "startDate":
                this.predicate.delete('startDate')
                this.predicate.set('startDate', value)
                break
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams
    }

    setSelectedEvent = (event: EventsModel | undefined) => {
        this.selectedEvent = event
    }

    clearSelectedEvent = () => {
        this.selectedEvent = undefined
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination
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

    get axiosParams() {
        const params = new URLSearchParams()
        params.append('pageNumber', this.pagingParams.pageNumber.toString())
        params.append('pageSize', this.pagingParams.pageSize.toString())
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            }
            else {
                params.append(key, value)
            }
        })

        return params
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
            const result = await axiosAgent.EventActions.getAllEvents(this.axiosParams)
            result.data.forEach((event) => {
                this.setEvent(event)
            });

            this.setPagination(result.pagination)
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

    createEvent = async (event: EventFormValues) => {
        this.setLoadingInitial(true)

        const userID = store.userStore.currentUser?.userID
        const user = await axiosAgent.ProfileActions.getProfile(userID!)

        const guests = new Profile(user!)

        try {
            event.eventID = uuid();
            event.status = EventStatus.NotYetStarted
            event.createdTime = new Date();
            event.updatedAt = new Date()

            await axiosAgent.EventActions.createEvent(event)
            let newEvent = new EventsModel(event)

            newEvent.hostUserID = user!.userID
            newEvent.guests = [guests]
            newEvent.isGoing = true
            newEvent.isHost = true

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

    updateEvent = async (event: EventFormValues) => {
        this.setLoadingInitial(true)

        try {
            await axiosAgent.EventActions.updateEvent(event)

            runInAction(() => {
                if (event.eventID) {
                    const updatedEvent = { ...this.getEvent(event.eventID), ...event }
                    this.setEvent(updatedEvent as EventsModel)
                    this.setSelectedEvent(updatedEvent as EventsModel)
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

    updateAttendance = async () => {
        this.loading = true
        const userID = store.userStore.currentUser?.userID
        const user = await axiosAgent.ProfileActions.getProfile(userID!)

        try {
            await axiosAgent.EventActions.attendEvent(this.selectedEvent!.eventID)
            runInAction(() => {
                if (this.selectedEvent?.isGoing) { // Cancel attendance
                    this.selectedEvent.guests = this.selectedEvent.guests
                        .filter(x => x.userID !== user?.userID)
                    this.selectedEvent.isGoing = false
                }
                else { // Attend event
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

        try {
            await axiosAgent.EventActions.attendEvent(this.selectedEvent!.eventID)
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

    updateGuestFollowing = (userID: string) => {
        this.eventListRegistry.forEach((event) => {
            event.guests.forEach((guest) => {
                if (guest.userID === userID) {
                    guest.following ? guest.followersCount-- : guest.followersCount++
                    guest.following = !guest.following
                }
            })
        });
    }
}