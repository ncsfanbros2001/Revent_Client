import { Container } from "semantic-ui-react";
import "./Stylesheets/global.css";
import Navbar from "./Components/Common/Navbar";
import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import ModalContainer from "./Components/Form/ModalContainer";

const App = () => {
    return (
        <Fragment>
            <ModalContainer />
            <Navbar />
            <Container style={{ marginTop: "6em" }}>
                <Outlet />
            </Container>
        </Fragment>
    );
};

export default observer(App);
