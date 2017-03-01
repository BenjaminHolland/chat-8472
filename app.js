//setup the app. It'd be nice to be do this in a class.
var express=require('express');
var app=express();
var http=require('http').Server(app);
var sio=require('socket.io')(http);
app.set('port',(process.env.PORT||5000));
app.use(express.static(__dirname+'/public'));
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.get('/',function (req,res){
		res.render('index');
	});

//Setup short-term server-side user tracking list and methods for working with it.
//This should probably be a class, but I'm not entirely sure how to do tihs.
var users={'users':[]};
function addUser(name){
	users.users.push(name);
	sio.emit('users.list',users);
}

function removeUser(name){
	var index=users.users.indexOf(name);
	if(index>-1){
	users.users.splice(users.users.indexOf(name),1);
	}
	sio.emit('users.list',users);
}

//Set up callbacks for socket.io and submit fake messages and users.
//Not sure if this should go in the app class or be done independently. 
sio.on('connection', (socket)=>{
	socket.on('user.login.google',(data)=>{
		console.log('User on socket '+socket['id']+'logged in.');
		console.log(JSON.stringify(data,null,2));
	});
	socket.on('disconnect',(data)=>{
		console.log('User disconnected.');
		removeUser(socket.id);
	});
	socket.emit('users.list',{'users':['a','b','c']});
	addUser(socket.id);
	socket.emit('messages.list',{'messages':['message 1','message 2','message 3']});
	console.log("What a wonderful connection.");
});

//start the app server.	
http.listen(app.get('port'),function(){
	console.log("Test listening at port "+app.get('port'));
});
