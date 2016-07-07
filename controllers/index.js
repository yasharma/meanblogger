var express = require('express')
  , router = express.Router()
  , fs = require('fs');


/* App middleware */
router.use(function(req, res, next){
	console.log('%s %s %s', req.method, req.url, req.path);
	next();
});

/* dynmically require all controllers except index.js */
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
	var pathname = name.slice(0, -3);
	if(pathname === 'index') { return; }
	router.use('/' + pathname.toLowerCase(), require('./' + name));

});

module.exports = router;