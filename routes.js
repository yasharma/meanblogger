var express = require('express');
var router = express.Router();
var Post = require('./app/models/posts.js');
var path = require('path');
/* App middleware */
router.use(function(req, res, next){
	console.log('%s %s %s', req.method, req.url, req.path);
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
		Post.find({status: true}).limit(2).sort({created: -1}).exec(function(err, posts){
			if(err)
				res.send(err);

			res.json(posts);
		});
	});

router.route('/posts/paginate')
	.get(function(req, res){
		var limit = 10;
		var offset = (req.query.page) ? ((req.query.page - 1) * limit) : 0;
		Post.find({status: true}).count().exec(function(err, pageCount){
			if(pageCount){
				Post.find({status: true}).skip(offset).limit(limit).sort({created: -1}).exec(function(err, posts){
					res.json({records: posts, paging:{count: pageCount, limit: limit, page: req.query.page}});
				});
			} else {
				res.json({records: null, paging:{count: pageCount, limit: limit, page: req.query.page}});
			}
		}); 
	});

router.route('/posts/:id')
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			
			res.json(post);
		});
	})
	.put(function (req, res) {
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;
			post.image = req.body.image;

			post.save(function(err){
				if(err)
					res.send(err);

				res.json({message: 'Updated Successfully!!'});
			});
		});
	})
	.delete(function(req, res){
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

router.get('/', function(req, res) {
	//res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;