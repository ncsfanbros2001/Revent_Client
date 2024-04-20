import { makeAutoObservable, runInAction } from "mobx";
import { JwtInfoModel, LoginModel, RegisterModel, UserModel } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";
import { router } from "../router/Routes";
import { jwtDecode } from "jwt-decode";

export default class UserStore {
    currentUser: UserModel | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.currentUser
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
}