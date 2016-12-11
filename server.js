'use strict';
require('dotenv').config({silent: true});

let express 	= require('express'),
	app 		= express(),
	http 		= require('http').Server(app),
	io 			= require('socket.io')(http),
	bodyParser 	= require('body-parser'),
	mongoose 	= require('mongoose'),
	morgan 		= require('morgan'),
	database	= require('./config/database'),
	logger 		= require('./config/logger');

mongoose.Promise = global.Promise;
mongoose.connect(database.url);
mongoose.set('debug', false);

/* Express Middlewares */
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/modules`));

// Initialize favicon middleware
//app.use(favicon('./modules/core/client/img/brand/favicon.ico'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan( logger.getLogFormat(), logger.getMorganOptions() ));


io.on('connection', socket => {
	socket.on('syncposts', () => {
		io.emit('syncposts');
	});
});

/* Register all your routes */
app.use('/', require('./config/routes'));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.HOST_IP;

http.listen(server_port, server_ip_address, function(){
    console.log(`Listening on  ${server_ip_address}, server_port ${server_port}`);
});
module.exports = app;