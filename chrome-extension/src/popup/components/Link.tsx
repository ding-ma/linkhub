import React, {Component} from 'react';
import ILink from "../interfaces/ILink";
import {Button, Form} from "react-bootstrap";
import PaginationList from 'react-pagination-list';

interface IProps {
    workSpaceKey: string
}

interface IState {
    links: ILink[],
    loading: boolean,
    error: string,
    isAddingLink: boolean
    addingLink: ILink
}


class Link extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            links: [],
            loading: false,
            error: '',
            isAddingLink: false,
            addingLink: {docID:'', link:'', name:''}
        }
    }
    
    nameHandler = event => {
        const currState = this.state.addingLink
        currState['name'] = event.target.value
        this.setState({addingLink: currState})
    }
    
    urlHandler = event => {
        const currState = this.state.addingLink
        currState['link'] = event.target.value
        this.setState({addingLink: currState})
    }
    
    
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        const wkKey = this.props.workSpaceKey
        if (prevProps.workSpaceKey !== wkKey){
            this.setState({loading: true})
        }
        if (wkKey !== '' && this.state.loading){
            const url = "http://localhost:5555/link?key="+wkKey
            fetch(url)
                .then(async r =>{
                    if (!r.ok){
                        this.setState({error: await r.text(), loading: false})
                    } else {
                        const links = await r.json()
                        console.log(links)
                        this.setState( {links:links['links'], loading:false})
                    }
                })
        }
    }
    
    addHTTP(url:string): string {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }
    
    async submitNewLink(event){
        event.preventDefault()
        console.log(this.state.addingLink)
        
        const {name, link} = this.state.addingLink
        const endpoint = "http://localhost:5555/link"
        fetch(endpoint, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                link: link,
                key: this.props.workSpaceKey
            })
        })
            .then(async r => {
                if (!r.ok){
                    this.setState({error: await r.text()})
                }else{
                    const doc:ILink = await r.json()
                    doc['name'] = name
                    doc['link'] = this.addHTTP(link)
                    this.setState({links: [...this.state.links, doc]})
                }
            })
        this.setState({isAddingLink: false})
    }
    
    
    displayNameOrLink(name: string, link: string): string {
        if (name === ""){
            return link
        }
        return name
    }
    
    render() {

        if (this.state.isAddingLink){
            return(
                <Form className="text-center" autoComplete={'off'}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Link Name" onChange={this.nameHandler}/>
                    </Form.Group>
        
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="URL" onChange={this.urlHandler}/>
                    </Form.Group>
        
                    <Button variant="primary" type="submit" onClick={e => this.submitNewLink(e)}>
                        Create
                    </Button>
        
                    <Button variant="primary" type="reset" onClick={() => this.setState({isAddingLink: false})}>
                        Cancel
                    </Button>
                </Form>
            )
        }
        
        const addLink= (
            <div>
                <Button onClick={() => this.setState({isAddingLink: true})}>Add new link</Button>
            </div>
        )

        if (this.state.error !== '' ){
            return <span onClick={() => this.setState({error: ''})}>Error msg: {this.state.error}</span>
        }
        
        if (this.props.workSpaceKey === ''){
            return <div>First select a workspace!</div>
        }
        
        if (this.state.loading){
            return <div>Loading your links</div>
        }
        
        if (!this.state.loading && this.state.links.length == 0){
            return (<div>
                <div>No links found! Add some!</div>
                {addLink}
            </div>)
        }
        
        //todo implement pagination
        //todo stick pagination on the bottom
        return (
            <div>
                <PaginationList
                    data={this.state.links}
                    pageSize={5}
                    renderItem={(e:ILink) =>(
                        <a href={e.link} target="_blank" key={e.docID}>{this.displayNameOrLink(e.name, e.link)}</a>
                    )}
                />
                {addLink}
            </div>
        );
    }
}

export default Link;