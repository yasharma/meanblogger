/* jshint esversion: 6 */
/* jshint node: true */
"use strict";

let mongoose = require('mongoose'),
	Schema = mongoose.Schema,

 CategorySchema = new Schema({
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