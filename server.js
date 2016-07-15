(function(){
	"use strict";

	var express 	= require('express'),
		app 		= express(),
		http 		= require('http').Server(app),
		io 			= require('socket.io')(http),
		bodyParser 	= require('body-parser'),
		port 		= process.env.PORT || 3000,
		mongoose 	= require('mongoose'),
		morgan 		= require('morgan'),
		database	= require('./config/database');

	mongoose.connect(database.url); 
	mongoose.set('debug', true);

	/* Express Middlewares */
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(morgan('dev'));

	io.on('connection', function (socket) {
		socket.on('syncposts', function () {
			io.emit('syncposts');
		});
	});

	/* Register all your routes */
	app.use('/', require('./config/routes'));

	http.listen(port, function(){
		console.log('Magic happens on port ' + port);	
	});
}());