var appIds = {
  'google': '189610091735-mjde37ejomd603ihr2fiao8s40f4578e.apps.googleusercontent.com'
}

var express = require('express');
var app = express();
var http = require('http').Server(app); //Create HTTP Server? (Yes)
var sio = require('socket.io')(http); //Create SocketIO Interface with whatever http is. (It's an http server)

var GoogleAuth = require('google-auth-library'); //import googles authentication library
var gauth = new GoogleAuth; //"new" works strangely in js
var gauthClient = new gauth.OAuth2(appIds['google'], '', ''); //create a new OAuth2 client. Not sure what the other arguments are for yet. 

function Users() {
  this._current = new Map();
  this._temp = new Map();
  this._data = new Map();
}

Users.prototype.attachUser = function(socket) {
  console.log("Attatching new user on " + socket['id']);
  this._current.set(socket['id'],{'type:':'temp','id':socket['id']});
  this._temp.set(socket['id'],{'given_name':'Anon-'+socket['id']});
  this.dispatchRefresh();
}


Users.prototype.getUsers=function(){
  var userList=[];
  console.log(this._current);
  this._current.forEach((item, index, array)=>{
    console.log(this.item);
    if(item.type='temp'){
      userList.push(this._temp[item['id']]['given_name']);
    }else{
      userList.push(this._data[item['id']]['given_name']);
    }
  });
  return userList;
}

Users.prototype.dispatchRefresh=function(){
  sio.emit('users refresh',this.getUsers());
}

Users.prototype.detachUser = function(socket) {
  console.log("Detaching user on " + socket['id']);
  this._current.delete(socket['id']);
  if(this._temp.has(socket['id'])){
    this._temp.delete(socket['id']);
  }
  this.dispatchRefresh();
}

var users = new Users();

function confirmUser(socket, token, payload) {
  console.log("Confirming " + socket.id + " as " + token + ".");
  userCurrent[socket['id']]['token'] = token;
  if (!userData[token]) {
    console.log("Registering user.");
    userData[token] = userData[socket['id']];
    delete userData[socket['id']];
    userData[token] = payload;
  }
  else {
    console.log("User already registered.");
  }
}

function registerDisconnectHandler(socket) {
  socket.on('disconnect', targetSocket => {
    users.detachUser(socket);
  });
}

function registerConnectionHandler() {
  sio.on('connection', socket => {
    users.attachUser(socket);
    registerDisconnectHandler(socket);
  });
}

registerConnectionHandler()


//Application setup stuff directly from hadoku (more or less.)
//Only difference from the defaults here is that the http listener is being used instead of the app.
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
