#!/usr/bin/env node

var io = require('socket.io-client');
var ss = require('socket.io-stream');
var fs = require('fs');
var uuid = require('node-uuid');

var socket = io.connect('http://localhost:1445/shell');


socket.on('connect', function () {
  var stream = ss.createStream();

  ss(socket).emit('output', stream, {uuid: uuid.v4()});
  process.stdin.on('end', function () {
    console.log("stdin finished");
    stream.end();
  });
  var read = process.stdin.pipe(stream);


  console.log("callbacks in queue");
});

