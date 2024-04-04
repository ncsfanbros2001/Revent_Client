import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Newsfeed from "../Pages/Newsfeed";
import EventDetails from "../Pages/EventDetails";
import TestErrors from "../Pages/TestError";
import NotFound from "../Components/Errors/NotFound";
import ServerError from "../Components/Errors/ServerError";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Newsfeed /> },
            { path: 'details/:eventID', element: <EventDetails /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'notFound', element: <NotFound /> },
            { path: 'serverError', element: <ServerError /> },
            { path: '*', element: <Navigate to='/notFound' /> },
        ]
    }
]

export const router = createBrowserRouter(routes)