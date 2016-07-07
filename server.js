var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var port = process.env.PORT || 8082;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/meanblogger'); 
mongoose.set('debug', true);
app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
io.on('connection', function (socket) {
	socket.on('syncposts', function () {
		io.emit('syncposts');
	});
});

/* Register all your routes */
app.use('/', require('./controllers'));

http.listen(port, function(){
	console.log('Magic happens on port ' + port);	
});