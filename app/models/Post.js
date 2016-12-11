'use strict';

const mongoose 	= require('mongoose'),
	crypto		= require('crypto'),
	Schema 		= mongoose.Schema,

PostSchema = new Schema({
	body  : {
		type: String,
		text: true
	},
	image : String,
	originalname: String,
	imageurl: String,
	title : { 
		type: String,
		trim: true,
		required: true,
		text: true
	},
	status : { 
		type: Boolean, 
		default: true
	},
	slug: {
		type: String,
		lowercase: true,
		unique: true
	},
	created : { 
		type: Date, 
		default: Date.now 
	}
});

PostSchema.pre('save', function(next){
    let post = this;
    post.slug = post.title.replace(/[_/-\s]+/g, '-') + '-' + crypto.randomBytes(5).toString('hex');
    next();
}); 

module.exports = mongoose.model('Post', PostSchema);