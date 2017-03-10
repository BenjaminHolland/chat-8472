import * as React from 'react';
import { UserList } from './UserList';
import { MessageList } from './MessageList';
import { Socket } from './Socket';
import GoogleLogin from 'react-google-login';
export class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			'isLoggedIn':false
		}
		this.onLogin = this.onLogin.bind(this);
	}
	onLogin(response) {
		Socket.emit('users.login.google', response);
	}
	componentDidMount() {
		console.log('Mounted');
		Socket.on("users.login.confirm", (data) => {
			this.setState((prevState, props) => {
				return {
					'isLoggedIn': data.isLoggedIn
				};
			});
		});
		
	}
	
	render() {

		const isLoggedIn = this.state.isLoggedIn;

		let button = null;
		if (!isLoggedIn) {
			button = <GoogleLogin
				clientId='189610091735-mjde37ejomd603ihr2fiao8s40f4578e.apps.googleusercontent.com'
				buttonText="Login"
				onSuccess={this.onLogin}
				onFailure={this.onLogin}
			/>
		} else {
			button="";
		}
		return (
			<div>
				<div>
					<UserList />
				</div>
				<div>
					<MessageList />
				</div>
				<div>
					{button}	
				</div>

			</div>
		);
	}
}
