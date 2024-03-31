import { createContext, useContext } from "react";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";

interface Stores {
    eventStore: EventStore,
    modalStore: ModalStore
}

export const store: Stores = {
    eventStore: new EventStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}