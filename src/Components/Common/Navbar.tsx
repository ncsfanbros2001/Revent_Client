import { Button, Container, Menu } from "semantic-ui-react";

interface Props {
    handleFormOpen: (eventId?: string) => void
}

const Navbar = (props: Props) => {
    const { handleFormOpen } = props

    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="/logo.png" alt="logo" style={{ marginRight: 8 }} /> Revent
                </Menu.Item>

                <Menu.Item name="Newsfeed" />
                <Menu.Item name="Notifications" />

                <Menu.Item>
                    <Button color="green" content="Create Activity" onClick={() => handleFormOpen()} />
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default Navbar;
