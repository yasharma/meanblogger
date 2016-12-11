/* jshint esversion: 6 */
/* jshint node: true */
"use strict";

var path = require('path'),
	Category = require(`${__dirname}/../app/models/Category`);

/* Create a new record /category */
module.exports.create = function(req, res, next){
	var categories = [];
	req.body.name.split(",").forEach((name) => {
	    categories.push({"name":name, "label": req.body.label});
	});
	Category.create(categories, (err, category) => {
		if(err){
			console.log(err);
			res.send(err);
		} else {
			res.json({message: 'Category Saved Successfully!', record: category, result: true});
		}
	});
};

/* Find/Get all active records along with paging /GET */
module.exports.paginate = function(req, res, next) {
	var limit = 10;
	var offset = (req.query.page) ? ((req.query.page - 1) * limit) : 0;
	Category.find({status: true}).count().exec((err, pageCount) => {
		if(err) res.send(err);
		if(pageCount){
			Category.find().skip(offset).limit(limit).sort({created: -1}).exec((err, categories) =>{
				res.json({records: categories, paging:{count: pageCount, limit: limit, page: req.query.page}});
			});
		} else {
			res.json({records: null, paging:{count: pageCount, limit: limit, page: req.query.page}});
		}
	});
};

/* FindById get single record /GET */
module.exports.findById = function(req, res, next){
	Category.findOne({_id: req.params.id}, (err, category) => {
		if(err){
			res.send(err);
		} else {
			res.json(category);
		}
	});
};

/* Update a record /PUT */
module.exports.update = function(req,res, next) {
	Category.findOne({_id: req.params.id}, (err, category) => {
		if(err){
			res.send(err);
		} else {
			category.name = req.body.name;
			category.label = req.body.label;
			category.status = req.body.status;
			category.save((err) => {
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
	Category.findOne({_id: req.params.id}, 'image', (err, category) => {
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
	Category.count((err, count) => {
		if(err){
			res.send(err);
		} else {
			res.json({count: count});
		}
	});
};
