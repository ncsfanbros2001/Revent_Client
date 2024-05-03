import { makeAutoObservable, runInAction } from "mobx";
import axiosAgent from "../API/axiosAgent";
import { toast } from "react-toastify";
import { store } from "./store";
import { Report } from "../Interfaces/report";

export default class ReportStore {
    loading: boolean = false
    reports: Report[] = []

    constructor() {
        makeAutoObservable(this)
    }

    sendReport = async (fouls: string, reportedID: string, violatedEventID: string) => {
        await axiosAgent.ReportActions.sendReport({
            foulCommited: fouls,
            reportedID: reportedID,
            violatedEventID: violatedEventID
        })
            .then(() => {
                axiosAgent.EventActions.getOneEvent(violatedEventID)
                    .then((response) => {
                        store.notiicationStore.sendNotification({
                            receiverIdList: [reportedID],
                            content: "An user has just report your event " + response.title
                                + ". The event will be temporarily suspended until we make our final decision. Thank you for your cooperation"
                        })
                    })
                store.eventStore.eventToList.filter(x => x.eventID !== violatedEventID)
                toast.success("Report has been sended to the admin")
                store.eventStore.loadAllEvents()
            })
            //.then(() => store.eventStore.loadAllEvents())
            .catch(() => toast.error("Can't send report"))
            .finally(() => store.modalStore.closeModal())
    }

    passJudgement = async (isGuilty: boolean, reportID: string) => {
        this.loading = true
        await axiosAgent.ReportActions.passJudgement({
            isGuilty: isGuilty,
            reportID: reportID
        })
            .then(() => {
                if (isGuilty) {
                    toast.success("This person has been penalized")
                }
                else {
                    toast.success("This event has been restored")
                }
                this.reports.filter(x => x.reportID === reportID)
            })
            .catch((error) => toast.error(error))
            .finally(() => runInAction(() => this.loading = false))
    }

    getReports = async () => {
        this.loading = true
        await axiosAgent.ReportActions.getReports()
            .then((response) => runInAction(() => this.reports = response))
            .finally(() => runInAction(() => this.loading = false))
    }
}