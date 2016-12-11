(function(){
	"use strict";

	var Post = require(__dirname +'/../app/models/Post'),
		path = require('path'),
		fs	 = require('fs');

	/* Create a new record /POST */
	module.exports.save = function(req, res, next){

		var post 			= new Post();
		post.title 			= req.body.title;
		post.body 			= req.body.body;
		post.imageurl 		= req.body.imageurl;
		if(req.file){
			post.image 			= req.file.filename;
			post.originalname 	= req.file.originalname;	
		}
		post.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Post created!', post: post});
			}
		});
	};

	/* Find/Get all active records /GET */
	module.exports.find = function(req, res, next) {
		Post.find({status: true}).sort({created: -1}).exec(function(err, posts){
			if(err){
				res.send(err);
			} else {
				res.json(posts);
			}
		});
	};

	/* Find/Get all active records along with paging /GET */
	module.exports.paginate = function(req, res, next) {
		var limit = 10,
			offset = (req.query.page) ? ((req.query.page - 1) * limit) : 0,
			condition = {};
		if (req.query.status) { condition.status = req.query.status; }
		Post.find(condition).count().exec(function(err, pageCount){
			if(err) res.send(err);
			if(pageCount){
				Post.find(condition).skip(offset).limit(limit).sort({created: -1}).exec(function(err, posts){
					res.json({records: posts, paging:{count: pageCount, limit: limit, page: req.query.page}});
				});
			} else {
				res.json({records: null, paging:{count: pageCount, limit: limit, page: req.query.page}});
			}
		}); 
	};

	/* FindById get single record /GET */
	module.exports.findBySlug = function(req, res, next){
		Post.findOne({slug: req.params.slug}, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.json(post);
			}
		});
	};

	/* Update a record /PUT */
	module.exports.update = function(req,res, next) {
		Post.findOne({_id: req.params.id}, function(err, post){
			if(err){
				res.send(err);
			} else {
				
				post.title = req.body.title;
				post.body = req.body.body;
				post.image = req.body.image;
				post.status = req.body.status;
				
				post.save(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Post updated Successfully!!', post: post, result: true});	
					}
				});
			}
		});
	};

	/* Delete a record /DELETE */
	module.exports.delete = function(req, res, next) {
		Post.findOne({_id: req.params.id}, 'image', function(err, post){
			fs.unlink(path.resolve('public/uploads/' + post.image), function(err){
				Post.remove({
					_id: post._id
				}, function(err, post){
					if(err){
						res.send(err);
					} else {
						res.json({ message: 'Post has deleted Successfully', result: true });
					}
				});
			});
		});	
	};

	/* Returns the count of total posts in DB */
	module.exports.count = function(req, res, next){
		Post.count(function(err, count){
			if(err){
				res.send(err);
			} else {
				res.json({count: count});
			}
		});
	};

	// Return searched result based on title and body
	module.exports.search = function(req, res, next){
		var search = req.query.q,
			limit = 10,
			offset = (req.query.page) ? ((req.query.page - 1) * limit) : 0;
		Post.find( { status: true, $text: { $search: "local area network" } } ).count().exec(function(err, resultCount){
			if(err) res.send(err);
			if(resultCount){
				Post.find({ status: true, $text: { $search: search } }, { score: { $meta: "textScore" } })
					.sort( { score: { $meta: "textScore" } } )
					.skip(offset).limit(limit)
					.exec(function(err, posts){
					if(err){
						res.send(err);
					} else {
						res.json({records: posts, paging:{count: resultCount, limit: limit, page: req.query.page, search: search}});
					}
				});
			}else {
				res.json({records: null, paging:{count: resultCount, limit: limit, page: req.query.page, search: search}});
			}
		});
	};

}());	