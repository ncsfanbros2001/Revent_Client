import { makeAutoObservable, reaction } from "mobx";
import { ServerErrorModel } from "../Interfaces/serverError";


export default class CommonStore {
    error: ServerErrorModel | null = null
    token: string | null | undefined = localStorage.getItem('userToken')
    appLoaded = false

    constructor() {
        makeAutoObservable(this)

        reaction( // Doesn't run on initial
            () => this.token, // Tell reaction to react to Token when change occurs
            (token) => { // "token" is the observable value that this reaction is tracking
                if (token) { // Login
                    localStorage.setItem('userToken', token)
                }
                else { // Logout
                    localStorage.removeItem('userToken')
                }
            }
        )
    }

    setServerError(error: ServerErrorModel) {
        this.error = error
    }

    setToken = (token: string | null) => {
        this.token = token
    }

    setAppLoaded = () => {
        this.appLoaded = true
    }
}