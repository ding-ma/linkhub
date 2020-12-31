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
import AddWorkspace from "./components/AddWorkspace";

interface IProps {

}

interface IState {
    selectedWorkspace: IWorkspace
    workspace: IWorkspace[]
    addWorkspace: string
    isCreatingNewWorkspace: boolean
    error: string
}

class Popup extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedWorkspace: {name: '', key: ''},
            workspace: [],
            addWorkspace: '',
            isCreatingNewWorkspace: false,
            error: ''
        }
        this.handleCreateWorkspace = this.handleCreateWorkspace.bind(this)
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
    
    
    handleCreateWorkspace(state: IState){
        this.setState(state)
    }
    
    
    async submitAddWorkspace(){
        //todo error handling
        const toAdd = this.state.addWorkspace
        if (toAdd === "" || toAdd.length !== 11){
            this.setState({error: "cant be empty or length != 11"})
            return
        }
        
        const workspaces = []
        this.state.workspace.forEach(e => workspaces.push(e.key))
        if (workspaces.includes(toAdd)){
            this.setState({error: "this workspace is already added"})
            return
        }

        const url = "http://localhost:5555/workspace?key="+toAdd
        const resp = await fetch(url)
            .then(async r => {
                if(!r.ok){
                    this.setState({error: await r.text()})
                }
                return r.json()
            })
            .catch(err =>console.log(err))

        this.setState({
            workspace: [...this.state.workspace, {"name": resp['name'], "key":toAdd}]
        })

        localStorage.setItem("workspace", JSON.stringify(this.state.workspace))
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        this.setState({addWorkspace: ''})
        console.log("state reset")
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
                            
                            <NavDropdown.Item onClick={() => this.setState({isCreatingNewWorkspace: true})}>Create New</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Form inline>
                            <FormControl type="text" placeholder="Add Workspace" className="mr-sm-n1"
                                         onChange={this.addWorkspaceHandler}/>
                            <Button variant="outline-primary" onClick={() => this.submitAddWorkspace()}>Add</Button>
                        </Form>
                    </Container>
                </Navbar>
                {!this.state.isCreatingNewWorkspace && <Link workSpaceKey={this.state.selectedWorkspace.key}/>}
                {this.state.isCreatingNewWorkspace && <AddWorkspace handler={this.handleCreateWorkspace.bind(this)}/>}
                {this.state.error !=='' && <span onClick={() => this.setState({error: ''})}>Error msg: {this.state.error}</span>}
            </div>
        );
    }
    
   
}

export default Popup;