import * as React from 'react';
import {Socket} from './Socket';
export class MessageList extends React.Component{
	constructor(props){
		super(props);
		this.state={
			'messages':[]
		}
	}
	componentDidMount(){
		Socket.on('messages.list',(data)=>{
			this.setState((prevState,props)=>{
				return  {
					'messages':data['messages']
					};
			});
		});
		console.log("Mounted Message List");
		
	}
	render(){
		let messages = this.state.messages.map(
            (n, index) =>
            <div className="message" key={index}>{n}</div>
        );
	return (
	<div className='messageContainer'>
	<div className='messageContainerHeader'>Messages</div>
	 <div className='messages'>{messages}</div></div>);		
	}

}
