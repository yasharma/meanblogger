var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8082;
var router = require('./routes');
app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Register all your routes */
app.use('/api', router);

app.listen(port, function(){
	console.log('Magic happens on port ' + port);	
});