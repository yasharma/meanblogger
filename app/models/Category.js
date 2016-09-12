(function(){
	"use strict";

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var CategorySchema = new Schema({
		label: {
			type: String,
			default: 'default'
		},
		postcount: Number,
		name : { 
			type: String,
			index: {
				unique: true
			},
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

	module.exports = mongoose.model('Category', CategorySchema);
}());