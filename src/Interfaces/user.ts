export interface UserModel {
    userID: string
    email: string
    fullname: string
    username: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
    avatarURL: string
    biography: string
    token: string
}

export interface RegisterModel {
    fullname: string
    username: string
    email: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
    password: string
}

export interface LoginModel {
    email: string
    password: string
}

export interface JwtInfoModel {
    userID: string,
    email: string
}

export interface IProfile {
    userID: string,
    fullname: string,
    username: string,
    avatarURL?: string
    followersCount: number
    followingCount: number
    following: boolean
}

export class Profile implements IProfile {
    constructor(user: UserModel) {
        this.userID = user.userID
        this.fullname = user.fullname
        this.username = user.username
        this.avatarURL = user.avatarURL
    }

    userID: string
    fullname: string
    username: string
    avatarURL?: string
    followersCount: number = 0
    followingCount: number = 0
    following: boolean = true
}