process.env.NODE_ENV = 'test';

var mongoose 	= require("mongoose"),
	User 		= require('../app/models/User'),
	chai 		= require('chai'),
	chaiHttp 	= require('chai-http'),
	server 		= require('../server'),
	should 		= chai.should();

chai.use(chaiHttp);

/* Test Register a new user */
describe('/POST register', function(){

	before(function(done){
		User.remove({}, function(err){
			done();
		});
	});

	it('it should not Register a user without username and password', function(done){
		var user = {
			username: null,
			password: null
		};
		chai.request(server)
			.post('/users/signup')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('username');
                res.body.errors.username.should.have.property('kind').eql('required');
                res.body.errors.should.have.property('password');
                res.body.errors.password.should.have.property('kind').eql('required');
                done();
			});
	});
	it('it should Register a user', function(done){
		var user = {
			username: 'Testing Bot',
			password: '123456'
		};
		chai.request(server)
			.post('/users/signup')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User registered successfully');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('password');
                done();
			});
	});
	it('it should not Register a user with same username', function(done){
		var user = {
			username: 'Testing Bot',
			password: '123456'
		};
		chai.request(server)
			.post('/users/signup')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql(11000);
                done();
			});
	});
});

describe('/POST login', function(){
	it('it should not login a user with wrong username and password', function(done){
		var user = {
			username: 'gibbrash',
			password: 'gibbrash'
		};
		chai.request(server)
			.post('/users/login')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('name');
                res.body.errors.should.have.property('message').eql('Authentication failed. User not found.');
                done();
			});
	});

	it('it should login a user', function(done){
		var user = {
			username: 'Testing Bot',
			password: '123456'
		};
		chai.request(server)
			.post('/users/login')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                res.body.should.have.property('token');
                done();
			});
	});
});