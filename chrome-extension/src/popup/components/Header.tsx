import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {
    Form,
    Navbar,
    FormControl,
    Nav,
    DropdownButton,
    Dropdown,
    InputGroup,
    Container,
    NavDropdown
} from "react-bootstrap";
import "./Header.scss"

interface IProps {

}

interface IState {

}

class Header extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <Navbar expand="lg" variant="light" bg="light">
                    <Container>
                        <NavDropdown title="Workspaces" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">WS1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">WS2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">WS3</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Create New</NavDropdown.Item>
                        </NavDropdown>
                        <Form inline>
                            <FormControl type="text" placeholder="Add Workspace" className="mr-sm-n1" />
                            <Button variant="outline-primary">Add</Button>
                        </Form>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default Header;