const expect = require('chai').expect;
const should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:8080';

var options = {
    transports: ['websocket'],
    'forceNew': true,
    'autoConnect':false
};

describe('Chat Server', () => {
    it("Broadcasts the user list when someone disconnects", (function(done) {
        var c1 = io.connect(socketURL,options);
        c1.on('connect', (data1) => {
            console.log("C1 Connected.");
            var c2 = io.connect(socketURL,options);
            c2.on('connect', (data2) => {
                console.log("C2 Connected.");
                c1.on('users.list', (data3) => {
                    console.log("got user list.");
                    if (data3.users.length == 2) {
                        console.log("Got sufficient users. Continuing...");
                        c2.on('disconnect',()=>{
                            console.log("C2 Disconnecting");
                        });
                        c1.on('users.list', (data4) => {
                            console.log("Got list after user disconnect.");
                            
                            data4.users.length.should.equal(1);
                            data4.users[0].should.equal(c1.id);
                            console.log("C1 Disconnecting.");
                            c1.disconnect();
                            
                        });
                        c2.on('disconnect',(data4)=>{
                            console.log("Complete.");
                            done();
                        });
                        c2.disconnect();
                        
                    }
                });
            });
            c2.connect();
        });
        c1.connect();
    }));
/*
    it("Broadcasts the user list when someone connects.", (function(done) {
        var c1 = io.connect(socketURL, options);
        var c2;
    
        c1.on("connect", (data) => {
            c2 = io.connect(socketURL, options);
            c2.connect();
        });
        
        c1.on("users.list", (data) => {
            if (data.users.length == 2) {
                console.log("Got User List with 2 leaders.");
                c1.on('disconnect', (data) => {
                    console.log("C1 Disconnected.")
                    c2.on('disconnect', (data) => {
                        console.log("C2 Disconnected");
                        done();
                    });
                    c2.disconnect();
                });
                data.users[0].should.equal(c1.id);
                data.users[1].should.equal(c2.id);
                c1.disconnect();
            }
        });
        c1.connect();
    }))*/
});
