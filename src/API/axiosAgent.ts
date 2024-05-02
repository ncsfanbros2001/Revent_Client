import axios, { AxiosError, AxiosResponse } from "axios";
import { EventFormValues, EventsModel, IStatistics, UserEvent } from "../Interfaces/event";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../Stores/store";
import { ChangePasswordModel, IProfile, LoginModel, RegisterModel, UpdateProfileModel, UserModel } from "../Interfaces/user";
import { Photo } from "../Interfaces/photo";
import { PaginatedResult } from "../Interfaces/pagination";
import { Notification, NotificationReceivers } from "../Interfaces/notification";
import { PassJudgementData, Report, SendReportData } from "../Interfaces/report";

axios.defaults.baseURL = 'http://localhost:5000/api';

const delay = (delayTime: number) => {
    return new Promise((resolve: any) => {
        setTimeout(resolve, delayTime)
    });
}

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

axios.interceptors.response.use(async (response) => {
    await delay(0);
    const pagination = response.headers["pagination"]

    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination))
        return response as AxiosResponse<PaginatedResult<any>>
    }
    else {
        return response
    }
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'eventId')) {
                router.navigate('/notFound')
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat()
            }
            else {
                toast.error(data)
            }
            break
        case 404:
            if (store.userStore.isLoggedIn) {
                router.navigate('/notFound')
            }
            else {
                toast.error(data.error)
            }
            break
        case 500:
            store.commonStore.setServerError(data)
            router.navigate('/serverError')
            break
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const EventActions = {
    getAllEvents: (params: URLSearchParams) => {
        return axios.get<PaginatedResult<EventsModel[]>>(`/Event`, { params }).then(responseBody)
    },
    getOneEvent: (eventId: string) => {
        return request.get<EventsModel>(`/Event/${eventId}`)
    },
    createEvent: (eventToCreate: EventFormValues) => {
        return request.post<void>(`/Event`, eventToCreate)
    },
    updateEvent: (eventToUpdate: EventFormValues) => {
        return request.put<void>(`/Event`, eventToUpdate)
    },
    deleteEvent: (eventID: string) => {
        return request.delete<void>(`/Event/${eventID}`)
    },
    attendEvent: (eventID: string) => {
        return request.post<void>(`/Event/attend/${eventID}`, {})
    },
    removeGuest: (eventID: string, userID: string) => {
        return request.delete<void>(`/Event/${eventID}/${userID}`)
    }
}

const AccountActions = {
    getCurrentUser: () => {
        return request.get<UserModel>(`/Account/findUser`)
    },
    login: (loginInfo: LoginModel) => {
        return request.post<UserModel>('/Account/login', loginInfo)
    },
    register: (registerInfo: RegisterModel) => {
        return request.post<string>('/Account/register', registerInfo)
    },
    updateProfile: (updateProfileInfo: UpdateProfileModel) => {
        return request.post<UserModel>('/Account/updateProfile', updateProfileInfo)
    },
    updateProfileVisibility: () => {
        return request.post<void>('/Account/updateProfileVisibility', {})
    },
    changePassword: (changePasswordInfo: ChangePasswordModel) => {
        return request.post<void>('/Account/changePassword', changePasswordInfo)
    },
    retrievePassword: (email: string) => {
        return request.post<string>('/Account/retrievePassword', { email: email })
    }
}

const ProfileActions = {
    getAllProfiles: (predicate: string) => {
        return request.get<IProfile[]>(`/Profile?predicate=${predicate}`)
    },
    getProfile: (userID: string) => {
        return request.get<IProfile>(`/Profile/${userID}`)
    },
    changeAvatar: (file: Blob, userID: string) => {
        let formData = new FormData();
        formData.append('File', file);
        formData.append('userID', userID);

        return axios.post<Photo>('/Photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    listFollowings: (userID: string, predicate: string) => {
        return request.get<IProfile[]>(`/follow/${userID}?predicate=${predicate}`)
    },
    updateFollowing: (userID: string) => {
        return request.post(`/follow/${userID}`, {})
    },
    statistics: (userID: string) => {
        return request.get<IStatistics>(`/Event/statistics/${userID}`)
    },
    userEvents: (userID: string, predicate: string) => {
        return request.get<UserEvent[]>(`/Event/userEvents/${userID}?predicate=${predicate}`)
    }
}

const InteractActions = {
    careToggle: (eventID: string) => {
        return request.post<void>(`/Interact/care/${eventID}`, {})
    }
}

const NotificationActions = {
    notificationToggle: () => {
        return request.post<void>(`/Notification`, {})
    },
    getNotification: () => {
        return request.get<Notification[]>(`/Notification`)
    },
    sendNotifications: (sendInfo: NotificationReceivers) => {
        return request.post<void>(`/Notification/send`, sendInfo)
    },
}

const ReportActions = {
    sendReport: (reportData: SendReportData) => {
        return request.post<void>(`/Report`, reportData)
    },
    getReports: () => {
        return request.get<Report[]>(`/Report`)
    },
    passJudgement: (passJudgementData: PassJudgementData) => {
        return request.put<void>(`/Report`, passJudgementData)
    }
}

const axiosAgent = {
    EventActions, AccountActions, ProfileActions, InteractActions, NotificationActions, ReportActions
}

export default axiosAgent;