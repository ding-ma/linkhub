import React, {Component} from 'react';

interface IProps {

}

interface IState {

}

class Link extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                some link here
            </div>
        );
    }
}

export default Link;