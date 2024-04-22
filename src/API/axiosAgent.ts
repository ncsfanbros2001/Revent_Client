import axios, { AxiosError, AxiosResponse } from "axios";
import { EventFormValues, EventsModel } from "../Interfaces/event";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../Stores/store";
import { LoginModel, Profile, RegisterModel, UserModel } from "../Interfaces/user";
import { Photo } from "../Interfaces/photo";
import { PaginatedResult } from "../Interfaces/pagination";

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
    await delay(1000);
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
        case 401:
            toast.error('Unauthorized')
            break
        case 403:
            toast.error('Forbidden')
            break
        case 404:
            router.navigate('/notFound')
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
    }
}

const AccountActions = {
    getCurrentUser: (userID: string) => {
        return request.get<UserModel>(`/Account/${userID}`)
    },
    login: (loginInfo: LoginModel) => {
        return request.post<UserModel>('/Account/login', loginInfo)
    },
    register: (registerInfo: RegisterModel) => {
        return request.post<UserModel>('/Account/register', registerInfo)
    }
}

const ProfileActions = {
    getProfile: (userID: string) => {
        return request.get<Profile>(`/Profile/${userID}`)
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
        return request.get<Profile[]>(`/follow/${userID}?predicate=${predicate}`)
    },
    updateFollowing: (userID: string) => {
        return request.post(`/follow/${userID}`, {})
    }
}

const axiosAgent = {
    EventActions, AccountActions, ProfileActions
}

export default axiosAgent;