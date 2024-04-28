import { Container } from "semantic-ui-react";
import "./Stylesheets/global.css";
import Navbar from "./Components/Common/Navbar";
import { Fragment, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import ModalContainer from "./Components/Form/ModalContainer";
import { ToastContainer } from "react-toastify";
import Login from "./Pages/Login";
import { useStore } from "./Stores/store";
import LoadingComponent from "./Components/Common/LoadingComponent";
import ConfirmModal from "./Components/Common/ConfirmModal";

const App = () => {
    const location = useLocation()
    const { commonStore, userStore } = useStore()

    useEffect(() => {
        if (commonStore.token && !userStore.currentUser) {
            userStore.getUser().finally(() => commonStore.setAppLoaded())
        }
        else {
            commonStore.setAppLoaded()
        }
    }, [commonStore, userStore])

    if (!commonStore.appLoaded) return <LoadingComponent content='Loading App ...' />

    return (
        <Fragment>
            <ToastContainer position="bottom-right" theme="colored" />
            <ModalContainer />
            <ConfirmModal />
            {location.pathname === '/' && !userStore.isLoggedIn ? (<Login />) : (
                <>
                    <Navbar />
                    <Container style={{ marginTop: "6em" }}>
                        <Outlet />
                    </Container>
                    {/* <Footer /> */}
                </>
            )}
        </Fragment>
    );
};

export default observer(App);
