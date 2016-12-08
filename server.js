var express      = require('express');
var app          = express();
var http         = require('http').createServer(app);
var socket       = require('socket.io');
var logger       = require('morgan');
var path         = require('path');
var mongoose     = require('mongoose');
var config       = require('./config/config');
var socketEvents = require('./socketEvents');

mongoose.connect(config.database);

app.use(express.static(path.join(__dirname,'public')));
app.use(logger('dev'));

app.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname,'public','index.html'));
});

http.listen(config.port);

var io = socket(http);
socketEvents(io);


