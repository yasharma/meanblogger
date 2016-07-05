var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: { type: String, lowercase: true, trim: true },
	body: String,
	image: String,
	status: { type: Boolean, default: true},
	created: { type: Date, default: new Date() }
});
mongoose.connect('mongodb://localhost:27017/meanblogger'); 
module.exports = mongoose.model('posts', PostSchema);