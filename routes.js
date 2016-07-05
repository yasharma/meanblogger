var express = require('express');
var router = express.Router();
var Post = require('./app/models/posts.js');
var path = require('path');
/* App middleware */
router.use(function(req, res, next){
	next();
});

/* App routes */
router.route('/posts')
	.post(function(req, res){
		var post = new Post();
		post.title = req.body.title;
		post.body = req.body.body;
		post.image = req.body.image;
		
		post.save(function(err){
			if(err)
				res.send(err);

			res.json({message: 'Post created!'});
		});
	})
	.get(function(req, res){
		Post.find({status: true}, function(err, posts){
			if(err)
				console.log(err);

			res.json(posts);
		});
	});

router.get('/', function(req, res) {
	//res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;