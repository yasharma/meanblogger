var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title		 : { type: String, lowercase: true, trim: true },
	body		 : String,
	image		 : String,
	status		 : { type: Boolean, default: true},
	created		 : { type: Date, default: Date.now }
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;