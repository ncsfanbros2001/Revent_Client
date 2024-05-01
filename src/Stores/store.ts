import { createContext, useContext } from "react";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import CommentStore from "./commentStore";
import ProfileStore from "./profileStore";
import NotificationStore from "./notificationStore";
import ReportStore from "./reportStore";

interface Stores {
    eventStore: EventStore,
    modalStore: ModalStore,
    commonStore: CommonStore,
    userStore: UserStore,
    commentStore: CommentStore,
    profileStore: ProfileStore,
    notiicationStore: NotificationStore,
    reportStore: ReportStore
}

export const store: Stores = {
    eventStore: new EventStore(),
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    commentStore: new CommentStore(),
    profileStore: new ProfileStore(),
    notiicationStore: new NotificationStore(),
    reportStore: new ReportStore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}