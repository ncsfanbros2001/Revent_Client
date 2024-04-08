export interface UserModel {
    userID: string
    email: string
    fullname: string
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