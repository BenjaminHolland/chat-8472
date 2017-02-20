import * as React from 'react';

import { Socket } from './Socket';

export class Button extends React.Component {
    
    constructor(props){
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        
    }    
    handleSubmit(event) {
        event.preventDefault();
            
        let random ={'id': this.props.getId(),'number': Math.floor(Math.random() * 100)};
        
        console.log("Sending "+random);
        Socket.emit('new number',random);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <button>Send up a random number!</button>
            </form>
        );
    }
}
