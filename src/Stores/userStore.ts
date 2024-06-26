import { makeAutoObservable, runInAction } from "mobx";
import { ChangePasswordModel, LoginModel, UpdateProfileModel, UserModel } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";
import { router } from "../router/Routes";
import { Visibility } from "../Utilities/staticValues";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { error } from "console";

export default class UserStore {
    currentUser: UserModel | null = null
    loading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.currentUser
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
        await axiosAgent.AccountActions.login(credentials)
            .then((response) => {
                store.commonStore.setToken(response.token)
                runInAction(() => this.currentUser = response)

                store.eventStore.setPredicate('all', 'true')
                router.navigate('/')
            })
            .catch((error) => {
                toast.error(error.response.data)
            })

    }

    logout = () => {
        store.commonStore.setToken(null)
        runInAction(() => {
            this.currentUser = null
            store.profileStore.profile = null

            store.eventStore.predicate.clear()
        })

        router.navigate('/')
    }

    updateProfile = async (updateProfileInfo: UpdateProfileModel) => {
        this.loading = true
        axiosAgent.AccountActions.updateProfile(updateProfileInfo)
            .then((response) => {
                runInAction(() => {
                    this.currentUser = response

                    if (store.profileStore.profile?.userID == response.userID) {
                        store.profileStore.profile = { ...store.profileStore.profile, ...updateProfileInfo }
                    }

                    store.modalStore.closeModal()
                    toast.success("Update Successfully")
                })
            })
            .catch((error) => toast.error(error.response.data))
            .finally(() => runInAction(() => { this.loading = false }))
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

    changePassword = async (changePasswordInfo: ChangePasswordModel) => {
        try {
            await axiosAgent.AccountActions.changePassword(changePasswordInfo)
            toast.success("Change Password Successfully")
        }
        catch (error) {
            console.log(error);
        }
    }

    getUser = async () => {
        try {
            const token = jwtDecode(store.commonStore.token!)
            if (new Date(Number(token.exp) * 1000) > new Date()) {
                const user = await axiosAgent.AccountActions.getCurrentUser()
                runInAction(() => this.currentUser = user)
            }
            else {
                store.commonStore.token = null
                localStorage.removeItem('userToken')
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}