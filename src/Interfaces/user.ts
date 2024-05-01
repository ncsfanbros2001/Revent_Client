export interface UserModel { // For the current user
    userID: string
    email: string
    fullname: string
    username: string
    avatarURL: string
    updatedAt: string
    notificationStatus: string
    role: string
    token: string
}

export interface RegisterModel { // For registering
    fullname: string
    username: string
    email: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
}

export interface LoginModel { // For logging in
    email: string
    password: string
}

export interface ChangePasswordModel { // For logging in
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export interface IProfile {
    userID: string
    email: string
    fullname: string
    username: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
    avatarURL?: string
    biography: string
    profileVisibility: string
    role: string

    followersCount: number
    followingCount: number
    following: boolean
}

export class Profile implements IProfile { // For user details
    constructor(userProfile: IProfile) {
        this.userID = userProfile.userID
        this.email = userProfile.email
        this.fullname = userProfile.fullname
        this.username = userProfile.username
        this.phoneNumber = userProfile.phoneNumber
        this.gender = userProfile.gender
        this.address = userProfile.address
        this.birthDate = userProfile.birthDate
        this.avatarURL = userProfile.avatarURL
        this.biography = userProfile.biography
        this.profileVisibility = userProfile.profileVisibility
        this.role = userProfile.role
    }

    userID: string = ''
    email: string = ''
    fullname: string = ''
    username: string = ''
    phoneNumber: string = ''
    gender: string = ''
    address: string = ''
    birthDate: Date | null = null
    avatarURL?: string = ''
    biography: string = ''
    profileVisibility: string = ''
    role: string = ''

    followersCount: number = 0
    followingCount: number = 0
    following: boolean = false
}

export class UpdateProfileModel { // For updating user info
    constructor(userInfo: IProfile) {
        this.fullname = userInfo.fullname
        this.username = userInfo.username
        this.phoneNumber = userInfo.phoneNumber
        this.gender = userInfo.gender
        this.address = userInfo.address
        this.birthDate = userInfo.birthDate
        this.biography = userInfo.biography
    }

    fullname: string
    username: string
    phoneNumber: string
    gender: string
    address: string
    birthDate: Date | null
    biography: string
}