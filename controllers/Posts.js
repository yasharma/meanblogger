(function(){
	"use strict";

	var Post = require(__dirname +'/../app/models/Post');

	/* Create a new record /POST */
	module.exports.save = function(req,res){
		var post = new Post(req.body);
		post.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Post created!', post: post});
			}
		});
	};

	/* Find/Get all active records /GET */
	module.exports.find = function(req, res) {
		Post.find({status: true}).sort({created: -1}).exec(function(err, posts){
			if(err){
				res.send(err);
			} else {
				res.json(posts);
			}
		});
	};

	/* Find/Get all active records along with paging /GET */
	module.exports.paginate = function(req, res) {
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
	};

	/* FindById get single record /GET */
	module.exports.findById = function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.json(post);
			}
		});
	};

	/* Update a record /PUT */
	module.exports.update = function(req,res) {
		Post.findById(req.params.id, function(err, post){
			if(err){
				res.send(err);
			} else {
				post.title = req.body.title;
				post.body = req.body.body;
				post.image = req.body.image;

				post.save(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Updated Successfully!!', post: post});	
					}
				});
			}
		});
	};

	/* Delete a record /DELETE */
	module.exports.delete = function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.json({ message: 'Successfully deleted' });
			}
		});
	};
}());	