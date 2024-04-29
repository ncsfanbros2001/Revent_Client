import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IProfile } from "../Interfaces/user";
import axiosAgent from "../API/axiosAgent";
import { store } from "./store";
import { IStatistics, UserEvent } from "../Interfaces/event";
import { toast } from "react-toastify";

export default class ProfileStore {
    profile: IProfile | null = null
    loadingProfile: boolean = false
    uploading: boolean = false
    followings: IProfile[] = []
    loadingFollowings: boolean = false
    loadingUpdateFollowing: boolean = false
    activeTab = 0
    eventStatistics: IStatistics | null = null
    userEvents: UserEvent[] = []
    loading = false

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 2 || activeTab === 3) {
                    const predicate = activeTab === 2 ? 'followers' : 'followings'
                    this.loadFollowings(predicate)
                }
                else {
                    this.followings = []
                }
            }
        )
    }

    clearUserProfile = () => {
        this.profile = null
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab
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

            const profile = this.profile
            const currentUser = store.userStore.currentUser

            runInAction(() => {
                // Check if user updates follow in the user details page
                if (profile && profile.userID !== currentUser?.userID && profile.userID === userID) {
                    following ? profile.followersCount++ : profile.followersCount--
                    profile.following = !profile.following
                }
                else if (profile && profile.userID === currentUser?.userID) {
                    following ? profile.followingCount++ : profile.followingCount--
                }

                this.followings.forEach((profile) => {
                    if (profile.userID === userID) {
                        profile.following ? profile.followersCount-- : profile.followersCount++
                        profile.following = !profile.following
                    }

                    if (profile.userID == currentUser?.userID) {
                        following ? profile.followersCount++ : profile.followersCount--
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

    getEventStatistics = () => {
        this.loading = true
        axiosAgent.ProfileActions.statistics()
            .then((response) => {
                runInAction(() => {
                    this.eventStatistics = response
                })
            })
            .catch(() => {
                toast.error("Error Loading Stats")
            })
            .finally(() => runInAction(() => this.loading = false))
    }

    loadUserEvents = (predicate?: string) => {
        this.loading = true
        axiosAgent.ProfileActions.userEvents(predicate!)
            .then((response) => {
                runInAction(() => {
                    this.userEvents = response
                })
            })
            .catch(() => {
                toast.error("Error Loading Events")
            })
            .finally(() => runInAction(() => this.loading = false))
    }
}