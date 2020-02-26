var express = require('express');
var app = express();
var uuid = require('node-uuid');
var net = require('net');
var fs = require('fs');


// app.use(express.bodyParser());

var buckets = {};

app.get('/bucket', function(req, res){
  var guid = uuid.v4();
  console.log('Creating bucket', guid);
  buckets[guid] = {
    socket: '/tmp/' + guid + '.socket'
  };

  res.status(200).send({result: 'bucket created',
           uuid: guid});
});

app.get('/bucket/:guid', function (req, res) {
  var guid = req.params.guid;
  if (!buckets.hasOwnProperty(guid)) {
    res.status(400, {result: 'error'});
    return;
  }
  var bucket = buckets[guid];
  var socketPath = bucket.socket;
  res.writeHead(200, {'Content-Type': 'text/plain'});

  var server = net.createServer(function(stream) {
    stream.on('data', function(c) {
      console.log("Data", c.toString());
      res.write(c.toString());
    });
    stream.on('end', function() {
      console.log("Closing bucket", guid);
      server.close();
      res.end();
    });
  });

 server.listen(socketPath);
});


app.listen(1444);
