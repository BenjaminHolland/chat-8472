var clientIds={
  'google':'189610091735-mjde37ejomd603ihr2fiao8s40f4578e.apps.googleusercontent.com'
}

var express = require('express');
var app = express();
var http = require('http').Server(app); //Create HTTP Server? (Yes)
var sio = require('socket.io')(http); //Create SocketIO Interface with whatever http is. (It's an http server)
var GoogleAuth = require('google-auth-library'); //import googles authentication library
var gauth = new GoogleAuth; //"new" works strangely in js
var gauthClient = new gauth.OAuth2(clientIds['google'], '', ''); //create a new OAuth2 client. Not sure what the other arguments are for yet. 
var entries = []; //Keeps track of current entries.

var currentUsers={};

//Associates user tokens with their data.
var users={
  0:"Anon"
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

function registerNewUserHandler(socket) {
  socket.on('new user', msg => {
    //log a digest of the new user.
    var m = "";
    var rawMsg = msg['id'] == 0 ? "0" : msg['id'];

    if (rawMsg.length < 10) {
      m = msg['id'];
    } else {
      console.log(typeof msg['id']);
      m = rawMsg.substr(0, 5) + "..." + rawMsg.substr(rawMsg.length - 5, 5);
    }

    console.log("New User: " + m);

    //verify the token with google. This could be expanded to use any other
    //auth things. Not entirely sure what to do if it fails though.
    gauthClient.verifyIdToken(
      msg['id'] == 0 ? 1 : msg['id'],
      clientIds['google'],
      (e, login) => {
        if (!e) {
          var payload = login.getPayload();
          console.log(payload);
          users[msg['id']] = payload['given_name'];
        }
        else {
          //Apparently this is an empty object. Not sure why.
          console.log(JSON.stringify(e, null, 4));
        }
      });
  });
}

function registerDisconnectHandler(socket) {
  socket.on('disconnect', targetSocket => {
    var user=currentUsers[socket['id']];
    console.log(user['name']+" disconnected");
    delete currentUsers[socket['id']];
    console.log(JSON.stringify(currentUsers,null,3));
  });
}

function registerConnectionHandler() {
  sio.on('connection', socket => {
    console.log('A user connected on socket '+socket['id']+'.');
    currentUsers[socket['id']]={'name':'Anon'+socket['id']};
    console.log(JSON.stringify(currentUsers,null,3));   
    
    emitCurrentNumbers();
    registerNewNumberHandler(socket);
    registerNewUserHandler(socket);
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
