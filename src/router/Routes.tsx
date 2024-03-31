import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Newsfeed from "../Pages/Newsfeed";
import EventDetails from "../Pages/EventDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Newsfeed /> },
            { path: '/details/:eventID', element: <EventDetails /> },
        ]
    }
]

export const router = createBrowserRouter(routes)