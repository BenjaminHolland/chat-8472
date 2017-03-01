var express=require('express');
var app=express();
var http=require('http').Server(app);
var sio=require('socket.io')(http);

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


app.set('port',(process.env.PORT||5000));
app.use(express.static(__dirname+'/public'));
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.get('/',function (req,res){
		res.render('index');
	});

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
http.listen(app.get('port'),function(){
	console.log("Test listening at port "+app.get('port'));
});
