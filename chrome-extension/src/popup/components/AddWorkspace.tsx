import React, {Component} from "react";
import IWorkspace from "../interfaces/IWorkspace";

interface IProps {
    handler: any
}

interface IState {
}

class AddWorkspace extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <h2>Create a new workspace</h2>
                <button onClick={() => this.props.handler()}>push</button>
            </div>
        );
    }
}

export default AddWorkspace;