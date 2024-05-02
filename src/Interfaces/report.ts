import { IEventsModel } from "./event"
import { IProfile } from "./user"

export interface SendReportData {
    foulCommited: string
    reportedID: string
    violatedEventID: string
}

export interface Report {
    reportID: string,
    foulCommited: string,
    sendTime: Date,
    reporter: IProfile,
    reported: IProfile,
    event: IEventsModel,
}

export interface PassJudgementData {
    isGuilty: boolean,
    reportID: string
}