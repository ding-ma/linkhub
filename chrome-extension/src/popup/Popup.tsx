import React, {Component} from "react";
import "./styles/Popup.scss";
import "./styles/Form.scss"
import Link from "./components/Link";
import Button from 'react-bootstrap/Button';
import IWorkspace from "./interfaces/IWorkspace";
import {Container, Form, FormControl, Navbar, NavDropdown} from "react-bootstrap";
import AddWorkspace from "./components/AddWorkspace";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClipboard, faMinusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ENDPOINT} from "./environment";
import EPopupModes from "./interfaces/EPopupModes";
import IDeleteWorkspace from "./interfaces/IDeleteWorkspace";

interface IProps {

}

interface IState {
    selectedWorkspace: IWorkspace
    workspace: IWorkspace[]
    addWorkspace: string
    addedWorkspace: IWorkspace
    popupMode: EPopupModes
    error: string
    deleteWorkspace: IDeleteWorkspace
}

class Popup extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedWorkspace: {name: '', key: ''},
            workspace: [],
            addWorkspace: '',
            popupMode: EPopupModes.VIEW,
            error: '',
            addedWorkspace: {name: '', key: ''},
            deleteWorkspace: {name: '', pwd: ''}
        }
        this.handleCreateWorkspace = this.handleCreateWorkspace.bind(this)
    }
    
    componentDidMount() {
        const lastWorkspace = JSON.parse(localStorage.getItem("currentWorkspace"))
        if (lastWorkspace != null) {
            this.setState({selectedWorkspace: lastWorkspace})
        }
        
        const workspaces = JSON.parse(localStorage.getItem("workspace"))
        if (workspaces != null) {
            this.setState({workspace: workspaces})
        }
    }
    
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevState.selectedWorkspace !== this.state.selectedWorkspace) {
            localStorage.setItem("currentWorkspace", JSON.stringify(this.state.selectedWorkspace))
        }
    }
    
    addWorkspaceHandler = event => {
        this.setState({addWorkspace: event.target.value})
    }
    
    deleteWorkspaceNameHandler = event => {
        this.setState({deleteWorkspace: {name: event.target.value, pwd: this.state.deleteWorkspace.pwd}})
    }
    
    deleteWorkspacePwdHandler = event => {
        this.setState({deleteWorkspace: {name: this.state.deleteWorkspace.name, pwd: event.target.value}})
    }
    
    
    handleCreateWorkspace(passedState: IState) {
        if (passedState.addedWorkspace !== undefined) {
            this.setState({
                workspace: [...this.state.workspace, {
                    "name": passedState.addedWorkspace.name,
                    "key": passedState.addedWorkspace.key
                }],
                selectedWorkspace: {"name": passedState.addedWorkspace.name, "key": passedState.addedWorkspace.key}
            })
            localStorage.setItem("workspace", JSON.stringify(this.state.workspace))
        }
        this.setState(passedState)
    }
    
    
    async submitAddWorkspace() {
        const toAdd = this.state.addWorkspace
        if (toAdd === "" || toAdd.length !== 11) {
            this.setState({error: "cant be empty or length != 11"})
            return
        }
        
        const workspaces = []
        this.state.workspace.forEach(e => workspaces.push(e.key))
        if (workspaces.includes(toAdd)) {
            this.setState({error: "this workspace is already added"})
            return
        }
        
        const resp = await fetch(ENDPOINT + "/workspace?key=" + toAdd)
            .then(async r => {
                if (r.ok) {
                    return r.json()
                } else {
                    this.setState({error: await r.text()})
                }
            })
        
        this.setState({
            workspace: [...this.state.workspace, {"name": resp['name'], "key": toAdd}],
            addWorkspace: '',
            selectedWorkspace: {"name": resp['name'], "key": toAdd},
            popupMode: EPopupModes.VIEW
        })
        
        localStorage.setItem("workspace", JSON.stringify(this.state.workspace))
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }
    
    deleteWorkspacePermanent(event) {
        event.preventDefault()
        
        const {name, pwd} = this.state.deleteWorkspace
        if (name !== this.state.selectedWorkspace.name) {
            this.setState({error: "Name typed wrong!"})
            return
        }
        fetch(ENDPOINT + "/workspace", {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: this.state.selectedWorkspace.key,
                pwd: pwd
            })
        })
            .then(async r => {
                if (r.ok) {
                    const newWorkspaces = this.state.workspace.filter(e =>
                        e.key !== this.state.selectedWorkspace.key && e.name !== this.state.selectedWorkspace.name
                    )
                    localStorage.setItem("workspace", JSON.stringify(newWorkspaces))
                    this.setState({
                        selectedWorkspace: {name: '', key: ''},
                        error: '',
                        workspace: newWorkspaces,
                        popupMode: EPopupModes.VIEW
                    })
                } else {
                    this.setState({error: await r.text()})
                }
            })
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }
    
    deleteWorkspaceLocal = (event) => {
        event.preventDefault()
        if (this.state.deleteWorkspace.name !== this.state.selectedWorkspace.name) {
            this.setState({error: "Name typed wrong!"})
            return
        }
        const newWorkspaces = this.state.workspace.filter(e => e.key !== this.state.selectedWorkspace.key)
        localStorage.setItem("workspace", JSON.stringify(newWorkspaces))
        this.setState({
            selectedWorkspace: {name: '', key: ''},
            error: '',
            workspace: newWorkspaces,
            popupMode: EPopupModes.VIEW
        })
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }
    
    copyToClipboard = () => {
        const textField = document.createElement('textarea');
        textField.innerText = this.state.selectedWorkspace.key;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }
    
    
    render() {
        
        const deleteLocalView = (
            <div className="center-form">
                <h4>Deleting the workspace LOCALLY</h4>
                <Form className="text-center" autoComplete={'off'}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder={"Retype (" + this.state.selectedWorkspace.name + ")"}
                                      onChange={(e) => this.deleteWorkspaceNameHandler(e)}
                        />
                    </Form.Group>
                    
                    <div className="button-padding">
                        <Button variant="primary" size="sm" type="submit" onClick={(e) => this.deleteWorkspaceLocal(e)}>
                            Delete
                        </Button>
                    </div>
                    
                    <div className="button-padding">
                        <Button variant="outline-danger" size="sm" type="reset" onClick={() => this.setState({popupMode: EPopupModes.VIEW})}>
                            Cancel
                        </Button>
                    </div>
                    
                </Form>
            </div>
        )
        
        const deletePermanentView = (
            <div className="center-form">
                <h4>Deleting the workspace PERMANENTLY</h4>
                <Form className="text-center" autoComplete={'off'}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder={"Retype (" + this.state.selectedWorkspace.name + ")"}
                                      onChange={(e) => this.deleteWorkspaceNameHandler(e)}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="Enter workspace Password"
                                      onChange={(e) => this.deleteWorkspacePwdHandler(e)}/>
                    </Form.Group>
    
                    <div className="button-padding">
                        <Button variant="primary" size="sm" type="submit" onClick={(e) => this.deleteWorkspacePermanent(e)}>
                            Delete
                        </Button>
                    </div>
                    
                    <div className="button-padding">
                        <Button  variant="outline-danger" size="sm" type="reset" onClick={() => this.setState({popupMode: EPopupModes.VIEW})}>
                            Cancel
                        </Button>
                    </div>
                    
                </Form>
            </div>
        )
        
        
        const deleteViewIcons = (this.state.selectedWorkspace.name === "" ? <div/> :
                <div className="modify">
                    <div>
                        <FontAwesomeIcon icon={faClipboard} onClick={this.copyToClipboard} className="fa-icon"/>
                    </div>
                    <div className="icon-padding">
                        <FontAwesomeIcon icon={faMinusCircle}
                                         onClick={() => this.setState({popupMode: EPopupModes.DELETE_LOCAL})}/>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faTrash}
                                         onClick={() => this.setState({popupMode: EPopupModes.DELETE_PERM})}/>
                    </div>
                </div>
        )
        
        const importWorkspaceView = (
            <div className="center-form">
                <h2>Import Workspace</h2>
                <Form className="text-center" autoComplete={'off'}>
    
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Workspace Key (11 characters)" className="mr-sm-n1"
                                      onChange={this.addWorkspaceHandler}/>
                    </Form.Group>
            
                                 
                    <div className="button-padding">
                        <Button variant="primary" size="sm" onClick={() => this.submitAddWorkspace()}>Add</Button>
                    </div>
                    
                    <div className="button-padding">
                        <Button variant="outline-danger" size="sm" type="reset"
                                onClick={() => this.setState({popupMode: EPopupModes.VIEW})}>
                            Cancel
                        </Button>
                    </div>
                    
                </Form>
            </div>
        )
        
        return (
            <div className="popupContainer">
                <Navbar expand="lg" className="navbar-custom">
                    <Container>
                        
                        <NavDropdown
                            title={this.state.selectedWorkspace.name === '' ?
                                "Workspace" :
                                "Workspace - " + this.state.selectedWorkspace.name
                            } id="collasible-nav-dropdown">
                            {
                                this.state.workspace.map(wk =>
                                    <NavDropdown.Item key={wk.key} onClick={() => this.setState({
                                        selectedWorkspace: wk,
                                        popupMode: EPopupModes.VIEW,
                                        error: '',
                                        deleteWorkspace: {name: '', pwd: ''}
                                    })}>{wk.name}</NavDropdown.Item>)
                            }
                            {this.state.workspace.length != 0 && <NavDropdown.Divider/>}
                            
                            <NavDropdown.Item
                                onClick={() => this.setState({popupMode: EPopupModes.CREATE})}>Create</NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => this.setState({popupMode: EPopupModes.IMPORT})}>Import</NavDropdown.Item>
                        </NavDropdown>
                        
                        {deleteViewIcons}
                    
                    </Container>
                </Navbar>
                
                {this.state.popupMode === EPopupModes.VIEW && <Link workSpaceKey={this.state.selectedWorkspace.key}/>}
                {this.state.popupMode === EPopupModes.CREATE &&
                <AddWorkspace handler={this.handleCreateWorkspace.bind(this)}/>}
                {this.state.popupMode === EPopupModes.IMPORT && importWorkspaceView}
                {this.state.popupMode === EPopupModes.DELETE_LOCAL && deleteLocalView}
                {this.state.popupMode === EPopupModes.DELETE_PERM && deletePermanentView}
                
                {this.state.error !== '' &&
                <span onClick={() => this.setState({error: ''})}>Error msg: {this.state.error}</span>}
            </div>
        );
    }
}

export default Popup;