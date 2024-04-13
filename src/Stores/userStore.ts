import { makeAutoObservable, runInAction } from "mobx";
import { JwtInfoModel, LoginModel, Profile, RegisterModel, UserModel } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";
import { router } from "../router/Routes";
import { jwtDecode } from "jwt-decode";

export default class UserStore {
    currentUser: UserModel | null = null
    profile: Profile | null = null
    loadingProfile: boolean = false
    uploading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    get isCurrentUser() {
        if (store.userStore.currentUser && this.profile) {
            return store.userStore.currentUser.userID === this.profile.userID
        }
        else {
            return false
        }
    }

    // get isLoggedIn() {
    //     return !!this.currentUser
    // }

    login = async (credentials: LoginModel) => {
        const user = await axiosAgent.AccountActions.login(credentials)
        store.commonStore.setToken(user.token)

        runInAction(() => this.currentUser = user)

        router.navigate('/')
    }

    logout = () => {
        store.commonStore.setToken(null)
        runInAction(() => {
            this.currentUser = null
            this.profile = null
        })

        router.navigate('/')
    }

    register = async (registerInfo: RegisterModel) => {
        const user = await axiosAgent.AccountActions.register(registerInfo)
        store.commonStore.setToken(user.token)

        runInAction(() => this.currentUser = user)

        router.navigate('/')
    }

    getUser = async () => {
        try {
            let decodedToken: JwtInfoModel = jwtDecode(store.commonStore.token!)
            const user = await axiosAgent.AccountActions.getCurrentUser(decodedToken.userID)
            runInAction(() => this.currentUser = user)
        }
        catch (error) {
            console.log(error)
        }
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true
        try {
            const profile = await axiosAgent.AccountActions.getProfile(username)
            runInAction(() => { this.profile = profile })

        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loadingProfile = false)
        }
    }

    changeAvatar = async (file: Blob) => {
        this.uploading = true
        try {
            const response = await axiosAgent.AccountActions.changeAvatar(file, this.currentUser!.userID)
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.avatarURL = photo.url
                }

                if (this.currentUser) {
                    this.currentUser.avatarURL = photo.url
                }
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.uploading = false)
        }
    }
}