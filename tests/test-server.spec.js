const expect = require('chai').expect;
const should=require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8080';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

var chatUser1 = {
    'name': 'Tom'
};
var chatUser2 = {
    'name': 'Sally'
};
var chatUser3 = {
    'name': 'Dana'
};
describe('Chat Server', () => {
    it("Broadcast the user list when someone connects.", (function(done) {
        var c1 = io.connect(socketURL, options);
        var c2;
        c1.on("connect",(data)=>{
            c2=io.connect(socketURL,options);
            c2.on()
            
        });
        c1.on("users.list",(data)=>{
            if(data.users.length==2){
                
                data.users[0].should.equal(c1.id);
                console.log(data.users[0]+"=="+c1.id);
                data.users[1].should.equal(c2.id);
                console.log(data.users[1]+"=="+c2.id);
                c1.disconnect();
                c2.disconnect();
                done();
            }
        });
    }))
});
