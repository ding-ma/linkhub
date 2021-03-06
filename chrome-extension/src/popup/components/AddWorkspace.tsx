import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import "../styles/Form.scss"
import {ENDPOINT} from "../environment";
import EPopupModes from "../interfaces/EPopupModes";
import TPopupStates from "../interfaces/TPopupStates";


interface IProps {
    handler: (state: TPopupStates) => void
}

interface IState {
    name: string
    password: string
    error: string
}

class AddWorkspace extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: '',
            password: '',
            error: ''
        }
    }
    
    nameHandler = event => {
        this.setState({name: event.target.value})
    }
    
    passwordHandler = event => {
        this.setState({password: event.target.value})
    }
    
    async submitWorkspace(event) {
        event.preventDefault()
        
        const {name, password} = this.state
        fetch(ENDPOINT + "/workspace", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name,
                "pwd": password
            })
        })
            .then(async r => {
                if (r.ok) {
                    const key = await r.json()
                    this.props.handler({
                        addedWorkspace: {name: name, key: key['key']},
                        popupMode: EPopupModes.VIEW,
                        error: ''
                    })
                    Array.from(document.querySelectorAll("input")).forEach(
                        input => (input.value = "")
                    );
                    this.setState({password: '', name: ''})
                } else {
                    this.props.handler({error: await r.text()})
                }
            })
    }
    
    
    render() {
        return (
            <div className="center-form">
                <h4>Create a new workspace</h4>
                
                <Form className="text-center" autoComplete={'off'}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Workspace Name" onChange={this.nameHandler}/>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="Workspace Password (needed to delete/modify)"
                                      onChange={this.passwordHandler}/>
                    </Form.Group>
                    
                    <div className="button-padding">
                        <Button variant="primary" size="sm" type="submit" onClick={(e) => this.submitWorkspace(e)}>
                            Create
                        </Button>
                    </div>
                    
                    <div className="button-padding">
                        <Button variant="outline-danger" size="sm" type="reset"
                                onClick={() => this.props.handler({popupMode: EPopupModes.VIEW, error:''})}>
                            Cancel
                        </Button>
                    </div>
                    
                </Form>
            </div>
        );
    }
}

export default AddWorkspace;