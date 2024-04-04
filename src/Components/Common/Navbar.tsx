import { Button, Container, Menu } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import { useStore } from "../../Stores/store";
import EventForm from "../Form/EventForm";

const Navbar = () => {
    const { modalStore } = useStore();
    const { openModal } = modalStore

    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/logo.png" alt="logo" style={{ marginRight: 8 }} /> Revent
                </Menu.Item>

                <Menu.Item name="Notifications" as={NavLink} to='/notifications' />

                <Menu.Item name="Errors" as={NavLink} to='/errors' />

                <Menu.Item>
                    <Button color="green" content="Create Event" onClick={() => openModal(<EventForm />)} />
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(Navbar);
