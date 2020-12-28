import React, {Component} from 'react';

interface IProps {

}

interface IState {

}


function fetchLinks() {
    // param is a highlighted word from the user before it clicked the button
    return fetch("http://localhost:5555/link?key=n0KnvMzrp4Q").then(resp => resp.json());
}

class Link extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

    }
    state = { result: {'links':[]} };

    toggleButtonState = () => {

        fetchLinks().then(result => {
            this.setState({ result });
        });
    };

    render() {
        return (
            <div>
                some link here
                <button onClick={this.toggleButtonState}> Click me </button>
                {console.log(this.state.result['links'])}
                {this.state.result['links'].map(l => <div key={l.docID}>{},{l.linkname}</div>)}
            </div>
        );
    }
}

export default Link;