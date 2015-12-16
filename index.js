var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var http_port = process.env.PORT || config.port;

var server = app.listen(http_port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Banzai app listening at http://%s:%s', host, port);
});
