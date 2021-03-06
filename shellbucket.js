var express = require('express')
  , http = require('http')
var app = express();
var server = app.listen(1445);
var io = require('socket.io').listen(server);
var leveldown = require('leveldown')
var levelup = require('levelup')
var util = require('util');
var concat = require('concat-stream');
var lexi = require('lexicographic-integer');
var logger = require('morgan');
var bodyparser = require('body-parser');
var methodoverride = require('method-override');
  app.use(logger);
  app.use(express.static(__dirname + '/public'));
  app.use(bodyparser);
  app.use(methodoverride);
var ss = require('socket.io-stream');
var ab2str = require('arraybuffer-to-string')
var db = levelup(leveldown('./buckets'), {
  valueEncoding: 'json'
})


var split = require('split');

var shell = io.of('/shell').on('connection', function(socket) {

  socket.on('hi', function () {
    console.log("Hello from web");
  });

  ss(socket).on('output', function(stream, data) {


    /*
    var write = concat(function (output) {
      var outputName = 'shell-output-' + data.uuid;
      console.log("saving shell output to", outputName);

      db.put(outputName, { output: output.toString() }, function (err) {
        if (err) return console.log('Ooops!', err);
          db.get(outputName, function (err, value) {
            if (err) return console.log('Could not get', err);
          });
      });

    }); 
    stream.pipe(write);
    */
    var outputName = 'shell-' + data.uuid;
    var seq = 0;
    stream.pipe(split()).on('data', function (buf) {
     db.put(outputName + '-' + lexi.pack(seq++, 'hex'), buf)
    }).on('end', function () {
      var lines = [];
      db.createReadStream({
         start: outputName,
         end: outputName + '-\uffff' }
      ).on('data', function (line) {
        lines.push(ab2str (line.value));
      }).on('error', function (err) {
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream closed')
        shell.emit('line', {lines: lines});
      });
    });

    // var streaming = stream.pipe(process.stdout);
  });
});
