var express = require('express')
  , http = require('http');
 
var app = express();
var server = app.listen(1445);
var io = require('socket.io').listen(server);
 
app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});
var ss = require('socket.io-stream');

io.of('/shell').on('connection', function(socket) {
  ss(socket).on('output', function(stream, data) {
    var streaming = stream.pipe(process.stdout);
  });
});
