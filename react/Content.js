import * as React from 'react';
import {UserList} from './UserList';
import {MessageList} from './MessageList';
import { Socket } from './Socket';
export class Content extends React.Component{
	componentDidMount(){
		console.log('Mounted');
	}
	render(){
		return(<div><div><UserList/></div><div><MessageList/></div></div>);
	}
}
