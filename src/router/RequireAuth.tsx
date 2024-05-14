import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useStore } from "../Stores/store"
import { observer } from "mobx-react-lite"

const RequireAuth = () => {
    const { userStore } = useStore()
    const location = useLocation()

    if (!userStore.isLoggedIn) {
        return <Navigate to='/' state={{ from: location }} />
    }
    else {
        return <Outlet />
    }
}

export default observer(RequireAuth)