import { makeAutoObservable, runInAction } from "mobx";
import { LoginModel, RegisterModel, UpdateProfileModel, UserModel } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";
import { router } from "../router/Routes";
import { Visibility } from "../Utilities/staticValues";

export default class UserStore {
    currentUser: UserModel | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get checkLastUpdate() {
        const updateDate = new Date(this.currentUser!.updatedAt!)
        updateDate.setDate(updateDate.getDate() + 90)
        return updateDate > new Date()
    }

    get nextUpdateDate() {
        const updateDate = new Date(this.currentUser!.updatedAt!)
        updateDate.setDate(updateDate.getDate() + 90)
        return updateDate
    }

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
            store.profileStore.profile = null
        })

        router.navigate('/')
    }

    register = async (registerInfo: RegisterModel) => {
        const user = await axiosAgent.AccountActions.register(registerInfo)
        store.commonStore.setToken(user.token)

        runInAction(() => {
            this.currentUser = user
        })

        router.navigate('/')
    }

    updateProfile = async (updateProfileInfo: UpdateProfileModel) => {
        try {
            const user = await axiosAgent.AccountActions.updateProfile(updateProfileInfo)

            runInAction(() => {
                this.currentUser = user

                if (store.profileStore.profile?.userID == this.currentUser.userID) {
                    store.profileStore.profile = { ...store.profileStore.profile, ...updateProfileInfo }
                }
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    updateProfileVisibility = async () => {
        try {
            await axiosAgent.AccountActions.updateProfileVisibility()

            runInAction(() => {
                const profile = store.profileStore.profile!
                if (profile.userID == this.currentUser!.userID) {
                    if (profile.profileVisibility === Visibility.Public) {
                        store.profileStore.profile!.profileVisibility = Visibility.Private
                    }
                    else {
                        store.profileStore.profile!.profileVisibility = Visibility.Public
                    }
                }
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    getUser = async () => {
        try {
            const user = await axiosAgent.AccountActions.getCurrentUser()
            runInAction(() => this.currentUser = user)
        }
        catch (error) {
            console.log(error)
        }
    }
}