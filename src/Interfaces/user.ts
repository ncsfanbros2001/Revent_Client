export interface UserModel {
    userID: string
    email: string
    fullname: string
    username: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
    avatar: string
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

export interface IGuestProfile {
    userID: string,
    fullname: string,
    username: string,
    avatar?: string
}

export class GuestProfile implements IGuestProfile {
    constructor(user: UserModel) {
        this.userID = user.userID
        this.fullname = user.fullname
        this.username = user.username
        this.avatar = user.avatar
    }

    userID: string
    fullname: string
    username: string
    avatar?: string
}