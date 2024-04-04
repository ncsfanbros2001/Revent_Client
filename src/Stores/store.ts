import { createContext, useContext } from "react";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";
import CommonStore from "./commonStore";

interface Stores {
    eventStore: EventStore,
    modalStore: ModalStore,
    commonStore: CommonStore
}

export const store: Stores = {
    eventStore: new EventStore(),
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}