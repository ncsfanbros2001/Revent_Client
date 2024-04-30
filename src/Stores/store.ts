import { createContext, useContext } from "react";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import CommentStore from "./commentStore";
import ProfileStore from "./profileStore";
import NotificationStore from "./notificationStore";

interface Stores {
    eventStore: EventStore,
    modalStore: ModalStore,
    commonStore: CommonStore,
    userStore: UserStore,
    commentStore: CommentStore,
    profileStore: ProfileStore,
    notiicationStore: NotificationStore
}

export const store: Stores = {
    eventStore: new EventStore(),
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    commentStore: new CommentStore(),
    profileStore: new ProfileStore(),
    notiicationStore: new NotificationStore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}