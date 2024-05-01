import { makeAutoObservable } from "mobx";
import axiosAgent from "../API/axiosAgent";
import { toast } from "react-toastify";
import { store } from "./store";

export default class ReportStore {
    loading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    sendReport = (fouls: string, reportedID: string, violatedEventID: string) => {
        axiosAgent.ReportActions.sendReport({
            foulCommited: fouls,
            reportedID: reportedID,
            violatedEventID: violatedEventID
        })
            .then(() => toast.success("Report has been sended to the admin"))
            .catch(() => toast.error("Can't send report"))
            .finally(() => store.modalStore.closeModal())
    }
}