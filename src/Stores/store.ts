import { createContext, useContext } from "react";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Stores {
    eventStore: EventStore,
    modalStore: ModalStore,
    commonStore: CommonStore,
    userStore: UserStore
}

export const store: Stores = {
    eventStore: new EventStore(),
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}