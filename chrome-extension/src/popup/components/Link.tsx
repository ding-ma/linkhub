import React, {Component} from 'react';
import ILink from "../interfaces/ILink";
import {Button, Form} from "react-bootstrap";
import PaginationList from 'react-pagination-list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlusCircle, faTimesCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ENDPOINT} from "../environment";
import "../styles/Form.scss"
import "../styles/Link.scss"

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

let currentURL: string;

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function (tabs) {
        currentURL = tabs[0].url
    });


class Link extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            links: [],
            loading: false,
            error: '',
            isAddingLink: false,
            addingLink: {docID: '', link: currentURL, name: ''}
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
                    /*
                    todo: implement sorting?
                    const respJs = await r.json()
                    const links: ILink[] = respJs['links']
                    links.sort((a,b) => a.link.localeCompare(b.link))
                    this.setState({links: links, loading: false})
                     */
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
            this.setState({loading: true, isAddingLink: false, error: ''})
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
        if (/\s/g.test(link)) {
            this.setState({error: "links can't contain white space"})
            return
        }
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
                        addingLink: {docID: '', link: currentURL, name: ''}
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
            return link.length > 40 ? link.slice(0, 40) + "..." : link
        }
        return name
    }
    
    
    handleEditLink(event, toChange: ILink) {
        //todo implemented later, use faPen
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
                <div className="center-form">
                    <h4>Add a link</h4>
                    <Form className="text-center" autoComplete={'off'}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Link Name" onChange={this.nameHandler}/>
                        </Form.Group>
                        
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="text" placeholder="URL" onChange={this.urlHandler}
                                          defaultValue={currentURL}/>
                        </Form.Group>
                        
                        <div className="button-padding">
                            <Button variant="primary" size="sm" type="submit" onClick={e => this.submitNewLink(e)}>
                                Create
                            </Button>
                        </div>
                        
                        <div className="button-padding">
                            <Button variant="outline-danger" size="sm" type="reset"
                                    onClick={() => this.setState({isAddingLink: false, error: ''})}>
                                Cancel
                            </Button>
                        </div>
                    
                    </Form>
                    {this.state.error !== '' &&
                    <div className="error-msg" onClick={() => this.setState({error: ''})}>
                        <span>{this.state.error}    </span>
                        <FontAwesomeIcon icon={faTimesCircle} size={"sm"}/>

                    </div>
                    }
                </div>
            )
        }
        
        const addLink = (
            <div className="fixedbutton icon-cursor">
                <FontAwesomeIcon icon={faPlusCircle} onClick={() => this.setState({isAddingLink: true})} size='lg'/>
            </div>
        )
        
        
        if (this.props.workSpaceKey === '') {
            return <div className="center-form">First select a workspace!</div>
        }
        
        if (this.state.loading) {
            return <div className="center-form">Loading your links</div>
        }
        
        if (!this.state.loading && this.state.links.length == 0) {
            return (
                <div className="center-form">
                    <div>No links found! Add some!</div>
                    {addLink}
                </div>)
        }
        
        return (
            <div>
                <PaginationList
                    data={this.state.links}
                    pageSize={9}
                    renderItem={(link: ILink) => (
                        <div key={link.docID} className="link-item">
                            <div onClick={() => window.open(link.link)} className="link-name">
                                {this.displayNameOrLink(link.name, link.link)}
                            </div>
                            
                            <div className="link-icon">
                                <FontAwesomeIcon icon={faTrash}
                                                 onClick={(event) => this.handleDeleteLink(event, link)}/>
                            </div>
                        </div>
                    )}
                />
                {addLink}
            </div>
        );
    }
}

export default Link;