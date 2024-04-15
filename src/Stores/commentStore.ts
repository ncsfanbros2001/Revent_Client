import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../Interfaces/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = []
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    createHubConnection = (eventID: string) => {
        if (store.eventStore.selectedEvent) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?eventID=' + eventID, {
                    accessTokenFactory: () => store.userStore.currentUser?.token! as string
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build()

            this.hubConnection.start().catch(error => console.log("Error establishing the connection: ", error))

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => this.comments = comments)
            })

            this.hubConnection.on('ReceiveComments', (comment: ChatComment) => {
                runInAction(() => this.comments.unshift(comment))
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping the connection: ", error))
    }

    clearComments = () => {
        this.comments = []
        this.stopHubConnection()
    }

    addComment = async (values: { content: string, eventID?: string, userID: string }) => {
        values.eventID = store.eventStore.selectedEvent?.eventID

        try {
            await this.hubConnection?.invoke("SendComment", values)
        }
        catch (error) {
            console.log(error);
        }
    }
}