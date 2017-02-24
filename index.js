var clientIds = {
  'google': '189610091735-mjde37ejomd603ihr2fiao8s40f4578e.apps.googleusercontent.com'
}

var express = require('express');
var app = express();
var http = require('http').Server(app); //Create HTTP Server? (Yes)
var sio = require('socket.io')(http); //Create SocketIO Interface with whatever http is. (It's an http server)
var GoogleAuth = require('google-auth-library'); //import googles authentication library
var gauth = new GoogleAuth; //"new" works strangely in js
var gauthClient = new gauth.OAuth2(clientIds['google'], '', ''); //create a new OAuth2 client. Not sure what the other arguments are for yet. 
var entries = []; //Keeps track of current entries.

var userCurrent = {};
var userData = {};

function attachUser(socket){
  console.log("Connection on "+socket['id']+".");
  userCurrent[socket['id']]={'token':socket['id']};
  userData[socket['id']]={'given_name':'Anon_'+socket['id']};
}

function detachUser(socket){
  console.log("Disconnection on "+socket['id']+".");
  delete userCurrent[socket['id']];
}

function confirmUser(socket,token,payload){
  console.log("Confirming "+socket.id+" as "+token".");
  userCurrent[socket['id']]['token']=token;
  if(!userData[token]){
    console.log("Registering user.");
    userData[token]=userData[socket['id']];
    delete userData[socket['id']];
    userData[token]=payload;
  }else{
    console.log("User already registered.");
  }
}

var users = {
  0: "Anon"
};

function formatEntries() {
  return entries.map(item => {
    return {
      'id': users[item['id']],
      'number': item['number']
    }
  });
}

function emitCurrentNumbers() {
  var message = {
    'numbers': formatEntries()
  };
  sio.emit('update numbers', message);
}

function registerNewNumberHandler(socket) {
  socket.on('new number', msg => {
    console.log("A new number appeared");
    entries.push({
      'id': msg['id'],
      'number': msg['number']
    });
    emitCurrentNumbers();
    console.log(JSON.stringify(entries, "", 4));
  });
}

function registerDisconnectHandler(socket) {
  socket.on('disconnect', targetSocket => {
    detachUser(socket);
  });
}

function registerAuthHandler(socket) {
  socket.on('user auth', msg => {
    gauthClient.verifyIdToken(
      msg['id'], clientIds['google'],
      (error, login) => {
        if (!error) {
          var payload = login.getPayload();
          confirmUser(socket,msg['id'],payload);
        }
        else {
          console.warn('Authentication Failed.');
        }
      });

  })
}


function registerConnectionHandler() {
  sio.on('connection', socket => {
    console.log('A user connected on socket ' + socket['id'] + '.');
    userCurrent[socket['id']] = {
      'name': 'Anon' + socket['id']
    };
    console.log(JSON.stringify(userCurrent, null, 3));

    emitCurrentNumbers();
    registerNewNumberHandler(socket);
    registerAuthHandler(socket);
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
