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

sio.on('connection', (socket)=>{
	socket.on('user.login.google',(data)=>{
		console.log('User on socket '+socket['id']+'logged in.');
		console.log(JSON.stringify(data,null,2));
	});
	socket.emit('users.list',{'users':['a','b','c']});
	socket.emit('messages.list',{'messages':['message 1','message 2','message 3']});
	console.log("What a wonderful connection.");
});	
http.listen(app.get('port'),function(){
	console.log("Test listening at port "+app.get('port'));
});
