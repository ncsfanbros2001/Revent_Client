import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Newsfeed from "../Pages/Newsfeed";
import EventDetails from "../Pages/EventDetails";
import NotFound from "../Components/Errors/NotFound";
import ServerError from "../Components/Errors/ServerError";
import ProfileDetails from "../Pages/ProfileDetails";
import RequireAuth from "./RequireAuth";
import Notifications from "../Pages/Notifications";
import ReportList from "../Components/Admin/ReportList";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: '', element: <Newsfeed /> },
                    { path: 'details/:eventID', element: <EventDetails /> },
                    { path: 'profiles/:userID', element: <ProfileDetails /> },
                    { path: 'reports', element: <ReportList /> },
                    { path: 'notFound', element: <NotFound /> },
                    { path: 'notifications', element: <Notifications /> },
                    { path: 'serverError', element: <ServerError /> },
                    { path: '*', element: <Navigate to='/notFound' /> },
                ]
            }
        ]
    }
]

export const router = createBrowserRouter(routes)