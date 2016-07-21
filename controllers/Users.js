(function(){
	"use strict";

	var User 	= require(__dirname +'/../app/models/User'),
		jwt 	= require('jsonwebtoken'),
		config 	= require(__dirname +'/../config/database');

	module.exports.register = function(req, res){
		var user = new User({ username: req.body.username, password: req.body.password });
		user.save(function(err, user){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'User registered successfully', user: user});
			}
		});
	};

	module.exports.authenticate = function(req, res){
		User.findOne({ username: req.body.username }, function(err, user){
			if(err){
				res.send(err);
			} else {
				if(!user){
					res.send({type: 'error', message: 'Authentication failed. User not found.'});
				} else {
					user.comparePassword(req.body.password, function(err, isMatch){
						if(isMatch && !err){
							var token = jwt.sign(user, config.secret);
							res.json({ user: user, token: token });
						} else {
							res.json({type: 'error', message: 'Authentication failed. Wrong password.'});
						}
					});
				}
			}
		});
	};
}());	