import React, {Component} from "react";
import "./Popup.scss";
import Link from "./components/Link";
import Button from 'react-bootstrap/Button';
import IWorkspace from "./interfaces/IWorkspace";
import {
    Form,
    Navbar,
    FormControl,
    Container,
    NavDropdown
} from "react-bootstrap";

interface IProps {

}

interface IState {
    selectedWorkspace: IWorkspace
    workspace: IWorkspace[]
    addWorkspace: string
}

class Popup extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedWorkspace: {name: '', key: ''},
            workspace: [],
            addWorkspace: ''
        }
    }
    
    componentDidMount() {
        const workspaces = JSON.parse(localStorage.getItem("workspace"))
        if (workspaces == null) {
            this.setState({workspace: []})
        } else {
            this.setState({workspace: workspaces})
        }
    }
    
    addWorkspaceHandler = event => {
        this.setState({addWorkspace: event.target.value})
    }
    
    
    async submitAddWorkspace(){
        //todo error handling
        const toAdd = this.state.addWorkspace
        if (toAdd === "" || toAdd.length !== 8){
            console.log("need to have a workspace")
            return
        }
        
        const workspaces = []
        this.state.workspace.forEach(e => workspaces.push(e.key))
        if (workspaces.includes(toAdd)){
            console.log("this workspace is already added")
            return
        }

        const url = "http://localhost:5555/workspace?key="+toAdd
        const resp = await fetch(url)
        console.log(resp)
        console.log(resp.status)
        console.log("aaaaaaaaaaaaaaa")
        if (resp.status != 200){
            console.log("somthing went wrong")
            return
        }
        const name = await resp.json()
        this.setState({
            workspace: [...this.state.workspace, {"name": name['name'], "key":toAdd}]
        })

        localStorage.setItem("workspace", JSON.stringify(this.state.workspace))
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        this.setState({addWorkspace: ''})
    }
    
    render() {
        return (
            <div className="popupContainer">
                <Navbar expand="lg" variant="light" bg="light">
                    <Container>
                        
                        <NavDropdown
                            title={this.state.selectedWorkspace.name === '' ?
                                "Workspace" :
                                "Workspace - " + this.state.selectedWorkspace.name
                            } id="collasible-nav-dropdown">
                            {
                                this.state.workspace.map(wk =>
                                    <NavDropdown.Item key={wk.key} onClick={() => this.setState({
                                        selectedWorkspace: {
                                            name: wk.name,
                                            key: wk.key
                                        }
                                    })}>{wk.name}</NavDropdown.Item>)
                            }
                            {this.state.workspace.length != 0 && <NavDropdown.Divider/>}
                            
                            <NavDropdown.Item>Create New</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Form inline>
                            <FormControl type="text" placeholder="Add Workspace" className="mr-sm-n1"
                                         onChange={this.addWorkspaceHandler}/>
                            <Button variant="outline-primary" onClick={() => this.submitAddWorkspace()}>Add</Button>
                        </Form>
                    </Container>
                </Navbar>
                <Link workSpaceKey={this.state.selectedWorkspace.key}/>
            </div>
        );
    }
    
   
}

export default Popup;