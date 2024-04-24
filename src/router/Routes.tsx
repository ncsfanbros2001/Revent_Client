import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Newsfeed from "../Pages/Newsfeed";
import EventDetails from "../Pages/EventDetails";
import NotFound from "../Components/Errors/NotFound";
import ServerError from "../Components/Errors/ServerError";
import ProfileDetails from "../Pages/ProfileDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Newsfeed /> },
            { path: 'details/:eventID', element: <EventDetails /> },
            { path: 'notFound', element: <NotFound /> },
            { path: 'serverError', element: <ServerError /> },
            { path: 'profiles/:userID', element: <ProfileDetails /> },
            { path: '*', element: <Navigate to='/notFound' /> },
        ]
    }
]

export const router = createBrowserRouter(routes)