import React, {Component} from 'react';
import ILink from "../interfaces/ILink";

interface IProps {
    workSpaceKey: string
}

interface IState {
    links: ILink[],
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
    
    async componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.workSpaceKey !== this.props.workSpaceKey){
            this.setState({loading: true})
        }
        if (this.props.workSpaceKey !== '' && this.state.loading){
            const url = "http://localhost:5555/link?key="+this.props.workSpaceKey
            const resp:ILink = await fetch(url).then(r => r.json())
            console.log(resp)
            this.setState( {links:resp['links'], loading:false})
        }
    }
    
    render() {
        console.log(this.props.workSpaceKey)
        
        if (this.props.workSpaceKey === ''){
            return <div>First select a workspace!</div>
        }
        
        if (this.state.loading){
            return <div>Loading your links</div>
        }
        
        if (!this.state.loading && this.state.links.length == 0){
            return <div>No links found! Add some!</div>
        }
        
        //todo implement pagination
        return (
            <div>
                <div>{this.state.links.map(link =>
                    <div id={link.docID}>
                        <h3>{link.name}</h3>
                        <p>{link.link}</p>
                    </div>
                )}</div>
            </div>
        );
    }
}

export default Link;