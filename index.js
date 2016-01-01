var http = require('http');
var express = require('express');
var sockjs = require('sockjs');
var app = express();
var _ = require('underscore');

var connections = [];

var config = {port:1337};



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use("/", express.static(__dirname + '/public'));

var http_port = process.env.PORT || config.port;
var chat = sockjs.createServer();

chat.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    console.log('USER CONNECTED: ' + number);
    conn.write(JSON.stringify({youruserid: number, text:"Welcome, User " + number}));

    conn.on('data', function(message) {
        var msg = _.extend({_user: number}, JSON.parse(message));

        if(!msg.x){
            console.log("USER " + number + ":");
            console.log(message);
        }

        var sendToAll = !msg._target || !msg._target.length || msg._target == '*';

        for (var ii=0; ii < connections.length; ii++) {
            if(sendToAll || msg._user == (ii+1) || msg._target == (ii+1).toString()){
                connections[ii].write(JSON.stringify(msg));
            }
        }
    });

    conn.on('close', function() {
        console.log("USER DCED: " + number);
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write(JSON.stringify({_user: number, disconnect:true, text:"User " + number + " has disconnected"}));
        }
    });
});

var server = http.createServer(app);
chat.installHandlers(server, {prefix:'/activity'});

server.listen(http_port);


/*var server = app.listen(http_port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Banzai app listening at http://%s:%s', host, port);
});*/



