import { makeAutoObservable, runInAction } from "mobx";
import { Profile } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null
    loadingProfile: boolean = false
    uploading: boolean = false
    followings: Profile[] = []
    loadingFollowings: boolean = false
    loadingUpdateFollowing: boolean = false

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

    loadProfile = async (userID: string) => {
        this.loadingProfile = true
        try {
            const profile = await axiosAgent.ProfileActions.getProfile(userID)
            console.log(profile)
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
            const response = await axiosAgent.ProfileActions.changeAvatar(file, store.userStore.currentUser!.userID)
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.avatarURL = photo.url
                }

                if (store.userStore.currentUser) {
                    store.userStore.currentUser.avatarURL = photo.url
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

    updateFollowing = async (userID: string, following: boolean) => {
        this.loadingUpdateFollowing = true

        try {
            await axiosAgent.ProfileActions.updateFollowing(userID)
            store.eventStore.updateGuestFollowing(userID)

            runInAction(() => {
                if (this.profile && this.profile.userID !== store.userStore.currentUser?.userID) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--
                    this.profile.following === !this.profile.following
                }
                this.followings.forEach((profile) => {
                    if (profile.userID === userID) {
                        profile.following ? profile.followersCount-- : profile.followersCount--
                        profile.following === !profile.following
                    }
                })
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loadingUpdateFollowing = false)
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true

        try {
            const followings = await axiosAgent.ProfileActions.listFollowings(this.profile!.userID, predicate)
            runInAction(() => {
                this.followings = followings
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loadingFollowings = false)
        }
    }
}