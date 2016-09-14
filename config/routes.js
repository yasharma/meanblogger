(function(){
	"use strict";
	
	var express 	= require('express'),
		router 		= express.Router(),
		expressJWT 	= require('express-jwt'),
		multer  	= require('multer'),
		config 		= require(__dirname + '/../config/database'),
		posts 		= require(__dirname +'/../controllers/Posts'),
		users 		= require(__dirname +'/../controllers/Users'),
		categories	= require(__dirname +'/../controllers/Categories'),
		upload 		= multer({ dest: './public/uploads/' });


	/* We don't need token based authentication for this routes */
	router.get('/posts/paginate', posts.paginate);
	router.get('/posts/search', posts.search);

	router.route('/posts/:slug').get(posts.findBySlug);

	/* Express JWT middleware */
	router.use(expressJWT({
		secret: config.secret
	}).unless({
		path:[
			'/posts/paginate',
			'/users/login',
			'/users/signup',
			'/favicon.ico'
		]
	}));

	/* App middleware */
	router.use(function(err, req, res, next){
		if(err){
			res.status(err.status || 500).json({
				errors:{
					name: err.name,
					message: err.message	
				}
			});
		}
		next();
	});

	/* Posts route */
	router.route('/posts').get(posts.find);
	
	router.post('/posts', upload.single('image'), posts.save);
	
	router.route('/posts/:id')
		.put(posts.update)
		.delete(posts.delete);


	/* Users route */
	router.post('/users/signup', users.register);	
	router.post('/users/login', users.authenticate);	

	/* Categories Route */
	router.get('/category/paginate', categories.paginate);
	router.post('/category/create', categories.create);
	router.route('/category/:id')
		.get(categories.findById)
		.put(categories.update)
		.delete(categories.delete);

	module.exports = router;
}());