(function(){
	"use strict";

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var PostSchema = new Schema({
		body  : String,
		image : String,
		originalname: String,
		imageurl: String,
		title : { 
			type: String,
			lowercase: true, 
			trim: true,
			required: true
		},
		status : { 
			type: Boolean, 
			default: true
		},
		created : { 
			type: Date, 
			default: Date.now 
		}
	});

	module.exports = mongoose.model('Post', PostSchema);
}());