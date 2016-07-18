(function(){
	"use strict";

	var mongoose 	= require('mongoose'),
		Schema 		= mongoose.Schema,
		bcrypt		= require('bcrypt'),

	UserSchema 	= new Schema({
		username: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		status: {
			type: Boolean,
			default: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

	/* Mongoose beforeSave Hook : To hash a password */
	UserSchema.pre('save', function(next){
		var user = this;
		if(this.isModified('password') || this.isNew){
			bcrypt.hash(user.password, 10, function(err, hash){
				if(err){
					return next(err);
				} else {
					user.password = hash;
					next();
				}
			});
		} else {
			return next();
		}
	});

	/* To check a password */
	UserSchema.methods.comparePassword = function(passw, cb){
		bcrypt.compare(passw, this.password, function(err, isMatch){
			if(err){
				return cb(err);
			} else {
				cb(null, isMatch);
			}
		});
	};

	module.exports = mongoose.model('User', UserSchema);
}());