import * as React from 'react';
import { Socket } from './Socket';
export class Content extends React.Component{
	componentDidMount(){
		console.log('Mounted');
	}
	render(){
		return(<div>Hello I Am A Content Yes</div>);
	}
}
