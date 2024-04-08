export interface EventsModel {
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
}
