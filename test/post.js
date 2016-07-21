process.env.NODE_ENV = 'test';

var mongoose 	= require("mongoose"),
	Post 		= require('../app/models/Post'),
	chai 		= require('chai'),
	chaiHttp 	= require('chai-http'),
	server 		= require('../server'),
	should 		= chai.should();


chai.use(chaiHttp);

/*
//Before each test we empty the database
describe('Posts', function () {
	beforeEach(function(done){
		Post.remove({}, function(err){
			done();
		});
	});
});*/


describe('/GET posts', function(){
	it('it should GET all the posts', function(done){
		chai.request(server)
			.get('/posts')
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('array');
                done();
			});
	});
});
