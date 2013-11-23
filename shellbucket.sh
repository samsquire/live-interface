#!/usr/bin/env node

process.stdin.resume();

var io = require('socket.io-client');
var ss = require('socket.io-stream');
var fs = require('fs');

var socket = io.connect('http://localhost:1445/shell');


socket.on('connect', function () {
  var stream = ss.createStream();

  ss(socket).emit('output', stream, {shell: true});
  var read = process.stdin.pipe(stream);

  process.stdin.on('end', function () {
    console.log("stdin finished");
    stream.end();
  });

  console.log("callbacks in queue");
});

