import * as React from 'react';
import {
    GoogleButton
}
from './GoogleButton';
import {
    Button
}
from './Button';
import {
    Socket
}
from './Socket';

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'id': 0,
            'localNumbers': []
        };
    }
    
    updateId(id){
        console.log("Update ID: "+id);
        Socket.emit('user auth',{'id':id});
        Socket.emit('new user',{'id':id});
        this.setState((prevState,props)=>{
        return {
            'id': id,
            'localNumbers':prevState['localNumbers']
        }});
        
    }
    
    componentDidMount() {
        Socket.on('users refresh',(data)=>{
            console.log(JSON.stringify(data,null,3));
        });
        Socket.on('update numbers', (data) => {
            console.log(data);
            this.setState((prevState, props) => {
                return {
                    'id': prevState['id'],
                    'localNumbers': data['numbers']
                }
            });
        });
    }
    
    getId(){
        return this.state['id'];
    }
    
    render() {


        let numbers = this.state.localNumbers.map(
            (n, index) =>
            <li className="number-item" key={index}>{n['id']},{n['number']}</li>
        );

        return (


            <div>
               
                <h1 className="heading">Random numbers so far!</h1>
                <Button getId={this.getId.bind(this)} />
                 <GoogleButton onIdUpdate={this.updateId.bind(this)}/>
                <ul>{numbers}</ul>
               
            </div>
        );
    }
}
