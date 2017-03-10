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
		Socket.on("users.update",(data)=>{
			console.log('returned new user list!');
			this.setState((prevState,props)=>{
				return {
					'users': data
				};
			});
		});
	}

	render(){
		let users=this.state.users.map((n,index)=><div className="user" key={index}><div>{n}</div></div>);
		return(<div className='usersContainer'><div className='usersHeader'>Users</div><div className='users'>{users}</div></div>);
	}
}
