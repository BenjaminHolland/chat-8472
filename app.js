'use strict';

class Messages {
	constructor(sio) {
		this._sio;
		this._messages = [];
	}
}

//Setup short-term server-side user tracking list and methods for working with it.
class Users {
	constructor(sio) {
		this._sio = sio;
		this._users = [];
	}

	broadcastUpdate() {
		this._sio.emit("users.update", this._users);
	}

	addUser(name) {
		this._users.push(name);
		this.broadcastUpdate();
	}

	updateUser(currentName, newName) {
		var idx = this._users.indexOf(currentName);
		if (idx >= 0) {
			this._users[idx] = newName;
		}
		this.broadcastUpdate();
	}

	removeUser(name) {
		var index = this._users.indexOf(name);
		console.log("Removing " + name);
		if (index > -1) {
			console.log("Removed" + name);
			this._users.splice(index, 1);
		} else {
			console.log("Failed to remove " + name);
		}
		this.broadcastUpdate();
	}
}

/*
var userList = new Users();
*/
class App {
	constructor() {
		this.express = require('express');
		this.app = this.express();
		this.http = require('http').Server(this.app);
		this.sio = require('socket.io')(this.http);
		this.users = new Users(this.sio);
		console.log("Constructed");
	}

	start() {
		console.log("starting app");
		console.log(this.app);
		this.app.set('port', (5000));
		this.app.use(this.express.static(__dirname + '/public'));
		this.app.set('views', __dirname + '/views');
		this.app.set('view engine', 'ejs');
		this.app.get('/', function (req, res) {
			res.render('index');
		});
		this.initCallbacks();
		//start the app server.	
		var lPort = this.app.get('port');
		this.http.listen(this.app.get('port'), function () {
			console.log("Test listening at port " + lPort);
		});
	}

	initCallbacks() {
		var self = this;
		this.sio.on('connection', (socket) => {

			socket.on('users.login.google', (data) => {
				console.log('User on socket ' + socket['id'] + 'logged in.');
				this.users.updateUser(socket['id'], data['googleId']);
				socket.emit("users.login.confirm", { 'isLoggedIn': true });	
			});

			socket.on('disconnect', (data) => {
				console.log('User disconnected.');
				console.log(self);
				self.users.removeUser(socket.id);
			});

			self.users.addUser(socket.id);

			socket.emit('messages.list', {
				'messages': ['message 1', 'message 2', 'message 3']
			});

			console.log("What a wonderful connection.");
		});
	}

}

var server = new App();
server.start();

/*
//Set up callbacks for socket.io and submit fake messages and users.
//Not sure if this should go in the app class or be done independently. 
sio.on('connection', (socket) => {
	socket.on('user.login.google', (data) => {
		console.log('User on socket ' + socket['id'] + 'logged in.');
		console.log(JSON.stringify(data, null, 2));
	});
	socket.on('disconnect', (data) => {
		console.log('User disconnected.');
		userList.removeUser(socket.id);
	});
	userList.addUser(socket.id);
	socket.emit('messages.list', {
		'messages': ['message 1', 'message 2', 'message 3']
	});
	console.log("What a wonderful connection.");
});

//start the app server.	
http.listen(app.get('port'), function() {
	console.log("Test listening at port " + app.get('port'));
});
*/