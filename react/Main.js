import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Content } from './Content';
import GoogleLogin from 'react-google-login';
import {Socket} from './Socket';
const responseGoogle=(response)=>{
	Socket.emit('user.login.google',response);
}

ReactDOM.render(<GoogleLogin
			clientId='189610091735-mjde37ejomd603ihr2fiao8s40f4578e.apps.googleusercontent.com'
			buttonText="Login"
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
		/>,
		document.getElementById('googleButton'));
ReactDOM.render(<Content/>,document.getElementById('content'));
