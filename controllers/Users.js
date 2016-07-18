(function(){
	"use strict";

	var User = require(__dirname +'/../app/models/User');

	module.exports.register = function(req, res){
		var user = new User({ username: req.body.username, password: req.body.password });
		user.save(function(err, user){
			if(err){
				res.send(err);
			} else {
				res.json({ type: 'success', msg: 'Users has been registered successfully', user: user });
			}
		});
	};

	module.exports.authenticate = function(req, res){
		User.findOne({ username: req.body.username }, function(err, user){
			if(err){
				res.send(err);
			} else {
				if(!user){
					res.send({type: 'error', msg: 'Authentication failed. User not found.'});
				} else {
					user.comparePassword(req.body.password, function(err, isMatch){
						if(isMatch && !err){
							// create a token
						} else {
							res.send({type: 'error', msg: 'Authentication failed. Wrong password.'});
						}
					});
				}
			}
		});
	};
}());	