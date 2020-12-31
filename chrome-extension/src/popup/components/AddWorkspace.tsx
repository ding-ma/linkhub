import React, {Component} from "react";
import IWorkspace from "../interfaces/IWorkspace";
import {Button, Form} from "react-bootstrap";
import "./AddWorkspace.scss"


interface IProps {
    //todo determine type
    handler: any
}

interface IState {
    name: string
    password: string
    error:string
}

class AddWorkspace extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: '',
            password:'',
            error:''
        }
    }
    
    nameHandler = event => {
        this.setState({name: event.target.value})
    }
    
    passwordHandler = event => {
        this.setState({password: event.target.value})
    }
    
    async submitWorkspace(event){
        event.preventDefault();
        
        const {name, password} = this.state
        const url = "http://localhost:5555/workspace"
       fetch(url, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name,
                "pwd": password
            })
        })
            .then( async r => {
                if (!r.ok){
                    this.props.handler({error: await r.text()})
                }
                const key = await r.json()
                this.props.handler({addedWorkspace: {name: name, key: key['key']}, isCreatingNewWorkspace: false})
            })
            
        
        
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        this.setState({password:'', name:''})
    }
    
    cancelNewWorkspace(){
        this.props.handler({ isCreatingNewWorkspace: false})
    }
    
    render() {
        return (
            <div>
                <h3>Create a new workspace</h3>
                
                <Form  className="text-center" autoComplete={'off'}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Workspace Name" onChange={this.nameHandler}/>
                    </Form.Group>
        
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="Workspace Password (needed to delete/modify)" onChange={this.passwordHandler}/>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" onClick={(e) => this.submitWorkspace(e)}>
                        Create
                    </Button>
    
                    <Button variant="primary" type="reset" onClick={() => this.cancelNewWorkspace()}>
                        Cancel
                    </Button>
                </Form>
            </div>
        );
    }
}

export default AddWorkspace;