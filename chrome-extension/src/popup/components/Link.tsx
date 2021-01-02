import React, {Component} from 'react';
import ILink from "../interfaces/ILink";
import {Button, Form} from "react-bootstrap";
import PaginationList from 'react-pagination-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ENDPOINT} from "../environment";

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
            addingLink: {docID: '', link: '', name: ''}
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
    
    fetchLinks() {
        fetch(ENDPOINT + "/link?key=" + this.props.workSpaceKey)
            .then(async r => {
                if (r.ok) {
                    const links = await r.json()
                    this.setState({links: links['links'], loading: false})
                } else {
                    this.setState({error: await r.text(), loading: false})
                }
            })
    }
    
    componentDidMount() {
        if (this.props.workSpaceKey !== '') {
            this.fetchLinks()
        }
    }
    
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        const wkKey = this.props.workSpaceKey
        if (prevProps.workSpaceKey !== wkKey) {
            this.setState({loading: true})
        }
        if (wkKey !== '' && this.state.loading) {
            this.fetchLinks()
        }
    }
    
    addHTTP(url: string): string {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }
    
    async submitNewLink(event) {
        event.preventDefault()
        
        const {name, link} = this.state.addingLink
        fetch(ENDPOINT + "/link", {
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
                if (r.ok) {
                    const doc: ILink = await r.json()
                    doc['name'] = name
                    doc['link'] = this.addHTTP(link)
                    this.setState({
                        links: [...this.state.links, doc],
                        isAddingLink: false,
                        addingLink: {docID: '', link: '', name: ''}
                    })
                    Array.from(document.querySelectorAll("input")).forEach(
                        input => (input.value = "")
                    );
                } else {
                    this.setState({error: await r.text()})
                }
            })
    }
    
    
    displayNameOrLink(name: string, link: string): string {
        if (name === "") {
            return link.length > 40 ? link.slice(0, 35) + "..." : link
        }
        return name
    }
    
    
    handleEditLink(event, toChange: ILink) {
        //todo implemented later
    }
    
    handleDeleteLink(event, toDelete: ILink) {
        fetch(ENDPOINT + "/link", {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: this.props.workSpaceKey,
                docID: toDelete.docID
            })
        })
            .then(async r => {
                if (r.ok) {
                    console.log("deleting")
                    const currLinks = this.state.links
                    const updatedLinks = currLinks.filter(e => e !== toDelete)
                    this.setState({links: updatedLinks})
                } else {
                    this.setState({error: await r.text()})
                }
            })
    }
    
    
    render() {
        if (this.state.isAddingLink) {
            return (
                <div>
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
                    {this.state.error !== '' &&
                    <span onClick={() => this.setState({error: ''})}>Error msg: {this.state.error}</span>}
                </div>
            )
        }
        
        const addLink = (
            <div>
                <Button onClick={() => this.setState({isAddingLink: true})}>Add new link</Button>
            </div>
        )
        
        
        if (this.props.workSpaceKey === '') {
            return <div>First select a workspace!</div>
        }
        
        if (this.state.loading) {
            return <div>Loading your links</div>
        }
        
        if (!this.state.loading && this.state.links.length == 0) {
            return (<div>
                <div>No links found! Add some!</div>
                {addLink}
            </div>)
        }
        
        //todo stick pagination on the bottom
        return (
            <div>
                <PaginationList
                    data={this.state.links}
                    pageSize={7}
                    renderItem={(link: ILink) => (
                        <div key={link.docID}>
                            <a href={link.link} target="_blank"
                               key={link.docID}>{this.displayNameOrLink(link.name, link.link)}
                            </a>
                            
                            {/*todo make it on hover only*/}
                            {/*<FontAwesomeIcon icon={faPen} onClick={(event) => this.handleEditLink(event, link)}/>*/}
                            <FontAwesomeIcon icon={faTrash} onClick={(event) => this.handleDeleteLink(event, link)}/>
                        </div>
                    )}
                />
                {addLink}
            </div>
        );
    }
}

export default Link;