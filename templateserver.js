var express = require('express');
var app = express();
var server = app.listen(1446);
var cons = require('consolidate');
var fs = require('fs');
var uuid = require('node-uuid');

app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.post('/render/:engine', function (req, res) {
  var guid = uuid.v4();
  var templateFilename = 'templates/' + guid;
  fs.writeFileSync(templateFilename, req.body.template);

  var data = req.body.data;
  cons[req.params.engine](templateFilename, data, function (err, rendered) {
    res.send(rendered);
  });
});
