export interface Notification {
    notificationID: string,
    content: string,
    createdTime: string
}

export interface NotificationReceivers {
    receiverIdList: string[]
    content: string
}