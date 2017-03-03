const expect = require('chai').expect;
const should=require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:8080';

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

    it("Broadcast The User List", (function*(done) {
        var client1 = io.connect(socketURL, options);
        client1.on('connect', (socket) => {
            socket.on('users.list', (data) => {
                console.log("Hello");
                done();  
            });
        })
    }))
});
