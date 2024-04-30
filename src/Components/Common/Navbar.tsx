import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../Stores/store";
import EventForm from "../Form/EventForm";
import Searchbar from "./Searchbar";

const Navbar = () => {
    const { modalStore, userStore } = useStore();
    const { openModal } = modalStore
    const { currentUser, logout } = userStore


    return (
        <Menu inverted fixed="top">
            <Container style={{ width: '80%' }}>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/logo.png" alt="logo" style={{ marginRight: 8 }} /> <b>REVENT</b>
                </Menu.Item>

                <Menu.Item name="Notifications" as={NavLink} to='/notifications' />

                <Menu.Item>
                    <Button icon="plus circle" color="green" content="Create Event" onClick={() => openModal(<EventForm />)} />
                </Menu.Item>

                <Menu.Item>
                    <Searchbar />
                </Menu.Item>

                <Menu.Item position="right">
                    <Image src={currentUser?.avatarURL || '/public/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={currentUser?.fullname}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profiles/${currentUser?.userID}`} text="My Profile" icon="user" />
                            <Dropdown.Item onClick={() => logout()} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(Navbar);
