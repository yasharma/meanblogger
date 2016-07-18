(function(){
	"use strict";
	
	var express = require('express'),
		router = express.Router(),
		posts = require(__dirname +'/../controllers/Posts'),
		users = require(__dirname +'/../controllers/Users');

	/* App middleware */
	router.use(function(req, res, next){
		// May be we can authenticate every request or something else
		next();
	});

	/* Posts route */
	router.route('/posts')
		.get(posts.find)
		.post(posts.save);

	router.get('/posts/paginate', posts.paginate);

	router.route('/posts/:id')
		.get(posts.findById)
		.put(posts.update)
		.delete(posts.delete);

	/* Users route */
	router.post('/users/signup', users.register);	
	router.post('/users/login', users.authenticate);	

	module.exports = router;
}());