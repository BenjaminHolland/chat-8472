import * as React from 'react';
import {Socket} from './Socket';
export class UserList extends React.Component{
	constructor(props){
		super(props);
		this.state={
			'users':[]
		
		};
	}

	componentDidMount(){
		console.log("Mounted UserList");
		Socket.on("users.list",(data)=>{
			console.log('returned new user list!');
			this.setState((prevState,props)=>{
				return {
					'users':data['users']
				};
			});
		});
	}

	render(){
		let users=this.state.users.map((n,index)=><li className="user" key={index}><div>{n}</div></li>);
		return(<div><ul>{users}</ul></div>);
	}
}
