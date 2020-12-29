import React, {Component} from 'react';
import LinkInterface from "../interfaces/LinkInterface";

interface IProps {
    workspace: string
}

interface IState {
    links: LinkInterface[],
    loading: boolean
}


class Link extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            links: [],
            loading: true
        }
    }
    
    async componentDidMount() {
        const url = "http://localhost:5555/link?key="+this.props.workspace
        const resp:LinkInterface = await fetch(url).then(r => r.json())
        this.setState( {links:resp['links'], loading:false})
    }
    
    render() {
        if (this.props.workspace === ''){
            return <div>First select a workspace!</div>
        }
        
        if (this.state.loading){
            return <div>Loading your links</div>
        }
        
        if (!this.state.loading && this.state.links.length == 0){
            return <div>No links found! Add some!</div>
        }
        
        return (
            <div>
                <div>{this.state.links.map(link =>
                    <div id={link.docID}>
                        <p>{link.link}</p>
                        <p>{link.name}</p>
                    </div>
                )}</div>
            </div>
        );
    }
}

export default Link;