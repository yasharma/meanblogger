(function(){
	"use strict";
	
	var express 	= require('express'),
		router 		= express.Router(),
		expressJWT 	= require('express-jwt'),
		config 		= require(__dirname + '/../config/database'),
		posts 		= require(__dirname +'/../controllers/Posts'),
		users 		= require(__dirname +'/../controllers/Users');


	/* We don't need token based authentication for this route */
	router.get('/posts/paginate', posts.paginate);
	router.route('/posts/:id').get(posts.findById);

	/* Express JWT middleware */
	router.use(expressJWT({
		secret: config.secret
	}).unless({
		path:[
			'/posts/paginate',
			'/users/login',
			'/users/signup'
		]
	}));

	/* App middleware */
	router.use(function(req, res, next){
		// May be we can authenticate every request or something else
		next();
	});

	/* Posts route */
	router.route('/posts')
		.get(posts.find)
		.post(posts.save);

	router.route('/posts/:id')
		.put(posts.update)
		.delete(posts.delete);

	/* Users route */
	router.post('/users/signup', users.register);	
	router.post('/users/login', users.authenticate);	

	module.exports = router;
}());