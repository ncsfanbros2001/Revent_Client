import { makeAutoObservable, runInAction } from "mobx";
import axiosAgent from "../API/axiosAgent";
import { toast } from "react-toastify";
import { store } from "./store";
import { NotificationStatus } from "../Utilities/staticValues";
import { Notification, NotificationReceivers } from "../Interfaces/notification";

export default class NotificationStore {
    notificationList: Notification[] = []
    loading: boolean = false
    loadingNotifications: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    toggleNotificationStatus = () => {
        this.loading = true
        axiosAgent.NotificationActions.notificationToggle()
            .then(() => {
                runInAction(() => {
                    const currentUser = store.userStore.currentUser!
                    if (currentUser.notificationStatus === NotificationStatus.Disabled) {
                        currentUser.notificationStatus = NotificationStatus.Enabled
                    }
                    else {
                        currentUser.notificationStatus = NotificationStatus.Disabled
                    }
                })
            })
            .catch((error) => {
                toast.error(error)
            })
            .finally(() => {
                runInAction(() => {
                    this.loading = false
                })
            })
    }

    getNotifications = () => {
        this.loadingNotifications = true
        axiosAgent.NotificationActions.getNotification()
            .then((response) => {
                runInAction(() => {
                    this.notificationList = response
                })
            })
            .catch((error) => {
                toast.error(error)
            })
            .finally(() => {
                runInAction(() => {
                    this.loadingNotifications = false
                })
            })
    }

    sendNotification = (sendInfo: NotificationReceivers) => {
        axiosAgent.NotificationActions.sendNotifications(sendInfo)
            .catch((error) => {
                toast.error(error)
            })
    }
}