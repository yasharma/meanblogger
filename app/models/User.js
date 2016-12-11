/* jshint esversion: 6 */
/* jshint node: true */
"use strict";

const mongoose 	= require('mongoose'),
	crypto 		= require('crypto'),
	path 		= require('path'),
	core 	 	= require(path.resolve('./config/core')),
	Schema 		= mongoose.Schema,
	
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
		user.password = this.hashPassword(core.salt, user.password);
		next();
	} else {
		return next();
	}
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (salt, password) {
  if (salt && password) {
    return crypto.createHmac('sha512', salt).update(password).digest('base64');
  } else {
    return password;
  }
};

/* To check a password */
UserSchema.methods.comparePassword = function(salt, password){
	return this.password === this.hashPassword(salt, password);
};

module.exports = mongoose.model('User', UserSchema);