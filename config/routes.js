(function(){
	"use strict";
	
	var express = require('express'),
		router = express.Router(),
		posts = require(__dirname +'/../controllers/Posts');

	/* App middleware */
	router.use(function(req, res, next){
		// May be we can autenticate every request or something else
		next();
	});

	router.route('/posts')
		.get(posts.find)
		.post(posts.save);

	router.get('/posts/paginate', posts.paginate);

	router.route('/posts/:id')
		.get(posts.findById)
		.put(posts.update)
		.delete(posts.delete);

	module.exports = router;
}());