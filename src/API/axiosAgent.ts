import axios, { AxiosResponse } from "axios";
import { Events } from "../Interfaces/event";

axios.defaults.baseURL = 'http://localhost:5000/api';

const delay = (delayTime: number) => {
    return new Promise((resolve: any) => {
        setTimeout(resolve, delayTime)
    });
}

// axios.interceptors.request.use((config) => {
//     config.headers['Content-Type'] = 'application/json';
//     console.log({
//         "URL": config.url,
//         "Method": config.method,
//         "Body": config.data,
//         "content type": config.headers
//     })

//     return config
// })

axios.interceptors.response.use(async (response) => {
    try {
        await delay(500);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
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
        return request.get<Events[]>(`/Event`)
    },
    getOneEvent: (eventId: string) => {
        return request.get<Events>(`/Event/${eventId}`)
    },
    createEvent: (event: Events) => {
        return request.post<void>(`/Event`, event)
    },
    updateEvent: (event: Events) => {
        return request.put<void>(`/Event/${event.eventID}`, event)
    },
    deleteEvent: (eventId: string) => {
        return request.delete<void>(`/Event/${eventId}`)
    },
}

const axiosAgent = {
    EventActions
}

export default axiosAgent;