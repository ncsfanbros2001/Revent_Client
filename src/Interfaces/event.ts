import { Profile } from "./user"

export interface IEventsModel {
    eventID: string
    title: string
    wallpaper: string
    location: string
    beginTime: Date | null
    endTime: Date | null
    category: string
    status: string
    description: string
    publicity: string
    attendDeadline: Date | null
    createdTime: Date | null
    updatedAt: Date | null
    hostUserID: string
    isGoing: boolean
    isHost: boolean
    host?: Profile
    guests: Profile[]
}

export class EventsModel implements IEventsModel {
    constructor(init: EventFormValues) {
        this.eventID = init.eventID!
        this.title = init.title
        this.wallpaper = init.wallpaper
        this.location = init.location
        this.beginTime = init.beginTime
        this.endTime = init.endTime
        this.category = init.category
        this.status = init.status
        this.description = init.description
        this.publicity = init.publicity
        this.attendDeadline = init.attendDeadline
        this.createdTime = init.createdTime
        this.updatedAt = init.updatedAt
    }

    eventID: string
    title: string
    wallpaper: string
    location: string
    beginTime: Date | null
    endTime: Date | null
    category: string
    status: string
    description: string
    publicity: string
    attendDeadline: Date | null
    createdTime: Date | null
    updatedAt: Date | null
    hostUserID: string = ''
    isGoing: boolean = false
    isHost: boolean = false
    host?: Profile
    guests: Profile[] = []
}

export class EventFormValues {
    eventID?: string = undefined
    title: string = ''
    wallpaper: string = ''
    location: string = ''
    beginTime: Date | null = null
    endTime: Date | null = null
    category: string = ''
    status: string = ''
    description: string = ''
    publicity: string = ''
    attendDeadline: Date | null = null
    createdTime: Date | null = null
    updatedAt: Date | null = null

    constructor(event?: EventsModel) {
        if (event) {
            this.eventID = event.eventID
            this.title = event.title
            this.wallpaper = event.wallpaper
            this.location = event.location
            this.beginTime = event.beginTime
            this.endTime = event.endTime
            this.category = event.category
            this.status = event.status
            this.description = event.description
            this.publicity = event.publicity
            this.attendDeadline = event.attendDeadline
            this.createdTime = event.createdTime
            this.updatedAt = event.updatedAt
        }
    }
}

export interface UpsertEventsModel {
    eventToUpsert: EventFormValues
    hostUserID: string
}
