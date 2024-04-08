import axios, { AxiosError, AxiosResponse } from "axios";
import { EventsModel } from "../Interfaces/event";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../Stores/store";
import { LoginModel, RegisterModel, UserModel } from "../Interfaces/user";

axios.defaults.baseURL = 'http://localhost:5000/api';

const delay = (delayTime: number) => {
    return new Promise((resolve: any) => {
        setTimeout(resolve, delayTime)
    });
}

axios.interceptors.response.use(async (response) => {
    await delay(500);
    return response;
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
    getAllEvents: () => {
        return request.get<EventsModel[]>(`/Event`)
    },
    getOneEvent: (eventId: string) => {
        return request.get<EventsModel>(`/Event/${eventId}`)
    },
    createEvent: (event: EventsModel) => {
        return request.post<void>(`/Event`, event)
    },
    updateEvent: (event: EventsModel) => {
        return request.put<void>(`/Event`, event)
    },
    deleteEvent: (eventId: string) => {
        return request.delete<void>(`/Event/${eventId}`)
    },
}

const AccountActions = {
    getCurrentUser: (userID: string) => {
        return request.get<UserModel>(`/account/${userID}`)
    },
    login: (loginInfo: LoginModel) => {
        return request.post<UserModel>('/account/login', loginInfo)
    },
    register: (registerInfo: RegisterModel) => {
        return request.post<UserModel>('/account/register', registerInfo)
    }
}

const axiosAgent = {
    EventActions, AccountActions
}

export default axiosAgent;