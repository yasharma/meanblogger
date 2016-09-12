(function(){
	"use strict";

	var path = require('path'),
		Category = require(__dirname +'/../app/models/Category');

	/* Create a new record /category */
	module.exports.create = function(req, res, next){
		var categories = [];
		req.body.name.split(",").forEach(function(name){
		    categories.push({"name":name, "label": req.body.label});
		});
		Category.create(categories, function(err, category){
			if(err){
				console.log(err);
				res.send(err);
			} else {
				res.json({message: 'Category Saved Successfully!', record: category, result: true});
			}
		});
	};

	/* Find/Get all active records /GET */
	module.exports.find = function(req, res, next) {
	};

	/* Find/Get all active records along with paging /GET */
	module.exports.paginate = function(req, res, next) {
		var limit = 10;
		var offset = (req.query.page) ? ((req.query.page - 1) * limit) : 0;
		Category.find({status: true}).count().exec(function(err, pageCount){
			if(err) res.send(err);
			if(pageCount){
				Category.find().skip(offset).limit(limit).sort({created: -1}).exec(function(err, categories){
					res.json({records: categories, paging:{count: pageCount, limit: limit, page: req.query.page}});
				});
			} else {
				res.json({records: null, paging:{count: pageCount, limit: limit, page: req.query.page}});
			}
		});
	};

	/* FindById get single record /GET */
	module.exports.findById = function(req, res, next){
		Category.findOne({_id: req.params.id}, function(err, category){
			if(err){
				res.send(err);
			} else {
				res.json(category);
			}
		});
	};

	/* Update a record /PUT */
	module.exports.update = function(req,res, next) {
		Category.findOne({_id: req.params.id}, function(err, category){
			if(err){
				res.send(err);
			} else {
				category.name = req.body.name;
				category.label = req.body.label;
				category.status = req.body.status;
				category.save(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Category updated Successfully!!', category: category, result: true});	
					}
				});
			}
		});
	};

	/* Delete a record /DELETE */
	module.exports.delete = function(req, res, next) {
		Category.findOne({_id: req.params.id}, 'image', function(err, category){
			Category.remove({
				_id: category._id
			}, function(err){
				if(err){
					res.send(err);
				} else {
					res.json({ message: 'Category has deleted successfully', result: true });
				}
			});
		});	
	};

	/* Returns the count of total categories in DB */
	module.exports.count = function(req, res, next){
		Category.count(function(err, count){
			if(err){
				res.send(err);
			} else {
				res.json({count: count});
			}
		});
	};
}());