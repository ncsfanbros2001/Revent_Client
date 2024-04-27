import { UserModel } from "./user"

export interface Care {
    fullname: string,
    userID: string,
    avatarURL: string
}

export class Care implements Care {
    fullname: string
    userID: string
    avatarURL: string

    constructor(careData: UserModel) {
        this.fullname = careData.fullname
        this.userID = careData.userID
        this.avatarURL = careData.avatarURL
    }
}