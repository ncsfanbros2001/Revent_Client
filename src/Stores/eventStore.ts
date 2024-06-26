import { makeAutoObservable, reaction, runInAction } from "mobx";
import { EventFormValues, EventsModel } from "../Interfaces/event";
import axiosAgent from "../API/axiosAgent";
import { v4 as uuid } from 'uuid'
import { store } from "./store";
import { EventStatus, Visibility } from "../Utilities/staticValues";
import { Pagination, PagingParams } from "../Interfaces/pagination";
import { Profile } from "../Interfaces/user";
import { toast } from "react-toastify";
import { Care } from "../Interfaces/care";

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

    get eventToList() { // Convert events to an array
        return Array.from(this.eventListRegistry.values())
            .filter(x => x.publicity !== Visibility.Private || x.status === EventStatus.Suspended)
            .sort((a, b) => Number(b.host!.following) - Number(a.host!.following))
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
            event.isCaring = event.cares.some(x => x.userID.toLowerCase() === user.userID.toLowerCase())
        }

        runInAction(() => {
            this.eventListRegistry.set(event.eventID, event)
        })
    }

    loadAllEvents = async () => {
        this.setLoadingInitial(true)

        await axiosAgent.EventActions.getAllEvents(this.axiosParams)
            .then(response => {
                response.data.forEach((event) => {
                    this.setEvent(event)
                });

                this.setPagination(response.pagination)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                this.setLoadingInitial(false)
            })
    }


    loadOneEvent = async (eventID: string) => {
        this.setLoadingInitial(true)
        let event = this.getEvent(eventID)
        if (event) { // If event is available inside the registry, set selected event to it
            this.setSelectedEvent(event)
        }
        else { // If event isn't available inside the registry, get it from DB, add it to the registry and assign it as selected event

            try {
                event = await axiosAgent.EventActions.getOneEvent(eventID)
                this.setEvent(event)
                this.setSelectedEvent(event)
            }
            catch (error) {
                console.log(error);
            }
        }
        this.setLoadingInitial(false)
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

            if (newEvent.publicity === Visibility.Public) {
                const currentUser = store.userStore.currentUser!
                const followers = (await axiosAgent.ProfileActions.listFollowings(currentUser.userID, "followers"))
                    .map(follower => follower.userID)


                store.notiicationStore.sendNotification({
                    receiverIdList: followers,
                    content: currentUser?.fullname + ' just post an event called "' + newEvent.title + '"'
                })
            }
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

            if (event.publicity === Visibility.Public) {
                const currentUser = store.userStore.currentUser!
                const thisEvent = this.getEvent(event.eventID!)!
                const guestsID = thisEvent.guests.map(x => x.userID)

                store.notiicationStore.sendNotification({
                    receiverIdList: guestsID.filter(x => x !== currentUser.userID),
                    content: currentUser?.fullname + ' just update an event called "' + thisEvent.title + '"'
                })
            }

            toast.success("Update Event Successfully")
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

            const currentUser = store.userStore.currentUser!
            const thisEvent = this.getEvent(this.selectedEvent!.eventID)!
            const guestsID = thisEvent.guests.map(x => x.userID)

            store.notiicationStore.sendNotification({
                receiverIdList: guestsID.filter(x => x !== currentUser.userID),
                content: currentUser?.fullname + ' just cancelled an event called "' + thisEvent.title + '"'
            })

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

    removeGuest = (userID: string, eventID: string) => {
        try {
            this.loading = true
            axiosAgent.EventActions.removeGuest(eventID, userID)

            this.eventListRegistry.forEach((event) => {
                if (event.eventID === eventID) {
                    event.guests = event.guests.filter(x => x.userID !== userID)
                }
            });
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => { this.loading = false })
        }
    }

    careToEvent = async (eventID: string) => {
        try {
            axiosAgent.InteractActions.careToggle(eventID)

            const user = store.userStore.currentUser!
            const eventToUpdate = this.eventListRegistry.get(eventID)!

            if (eventToUpdate?.isCaring === false) {
                eventToUpdate.careCount++
                eventToUpdate.cares.push(new Care(user))
                eventToUpdate.isCaring = true
            }
            else {
                eventToUpdate.careCount--
                eventToUpdate.cares.filter(x => x.userID !== user?.userID)
                eventToUpdate.isCaring = false
            }
            this.eventListRegistry.set(eventToUpdate.eventID, eventToUpdate)

        } catch (error) {
            toast.error("Error With Care")
        }
    }
}