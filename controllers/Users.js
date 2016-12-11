"use strict";

const jwt 	= require('jsonwebtoken'),
	path 	= require('path'),
	User 	= require(path.resolve('./app/models/User')),
	core 	= require(path.resolve('./config/core')),
	config 	= require(path.resolve('./config/database'));

module.exports.register = function(req, res, next){
	var user = new User({ username: req.body.username, password: req.body.password });
	user.save(function(err, user){
		if(err){
			res.send(err);
		} else {
			res.json({message: 'User registered successfully', user: user});
		}
	});
};

module.exports.authenticate = function(req, res, next){
	User.findOne({ username: req.body.username }, function(err, user){
		if(err){
			res.send(err);
		} else {
			if(!user){
				res.json({
					errors: {
						name: 'Authentication error', 
						message: 'Authentication failed. User not found.'
					}
				});
			} else {
				if(user.comparePassword(core.salt, req.body.password)){
					// Remove sensitive data before sending user object
					user.password = undefined;
					var token = jwt.sign(user, config.secret);
					res.json({ user: user, token: token });
				} else {
					res.json({
						errors: {
							name: 'Authentication error', 
							message: 'Authentication failed. Wrong password.'
						}	
					});
				}
			}
		}
	});
};
	