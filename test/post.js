process.env.NODE_ENV = 'test';

var path 	= require("path"),
	Post 		= require(path.resolve('./app/models/Post')),
	User 		= require(path.resolve('./app/models/User')),
	chai 		= require('chai'),
	chaiHttp 	= require('chai-http'),
	server 		= require(path.resolve('./server')),
	fs 			= require('fs'),
	should 		= chai.should();

chai.use(chaiHttp);
var token = null;
/* Before each test we empty the database */
describe('Posts', function () {
	
	it('it should empty the posts collection', function(done){
		beforeEach(function(done){
			/*Post.remove({}, function(err){
				done();
			});*/
			done();
		});
		done();
	});	
	
	before(function(done){
		var user = {
			username:'botuser', 
			password: '123456' 
		};
		chai.request(server)
		.post('/users/signup')
		.send(user)
		.end(function(err, res){
			chai.request(server)
			.post('/users/login')
			.send(user)
			.end(function(err, res){
				token = res.body.token;
				done();
			});
		});
	});

});

/* Test /GET all the posts */
describe('/GET posts', function(){
	it('it should GET all the posts', function(done){
		chai.request(server)
			.get('/posts')
			.set('Authorization', 'Bearer '+ token)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('array');
                done();
			});
	});
});

/* Test /POST Route */
describe('/POST posts', function(){
	/*it('it should not POST a post without title field', function(done){
		var post = {
			body: 'This is the body of my test post'
		};
		chai.request(server)
			.post('/posts')
			.set('Authorization', 'Bearer '+ token)
			.send(post)
			.end(function(err, res){
				console.log(res.body);
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('title');
                res.body.errors.title.should.have.property('type').eql('required');
                done();
			});
	});*/
	it('it should POST a post', function(done){
		chai.request(server)
			.post('/posts')
			.set('Authorization', 'Bearer '+ token)
			.field('title', 'This is title from my test')
			.field('body', 'This is the body of my test post')
			.attach('image', fs.readFileSync(fs.realpathSync('test/img/test.png')), 'test.png')
			.send()
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Post created!');
                res.body.post.should.have.property('title');
                res.body.post.should.have.property('body');
                res.body.post.should.have.property('created');
                res.body.post.should.have.property('status');
                done();
			});
	});
});

/* Test /GET posts by paginate with paging object */
describe('/GET posts/paginate?page=1', function(){
	it('it should GET all the posts by paginate', function(done){
		chai.request(server)
			.get('/posts/paginate?page=1')
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.should.have.property('paging');
                res.body.paging.should.have.property('count');
                res.body.paging.should.have.property('limit');
                res.body.paging.should.have.property('page');
                done();
			});
	});
});

/* Test /GET searched posts by paginate with paging object */
describe('/GET posts/search', function(){
	it('it should GET all the searched posts by paginate', function(done){
		chai.request(server)
			.get('/posts/search?page=1&q="local area network"&status=true')
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.should.have.property('paging');
                res.body.paging.should.have.property('count');
                res.body.paging.should.have.property('limit');
                res.body.paging.should.have.property('page');
                done();
			});
	});
});

/* Test /:id Route */
describe('/GET/:id post', function(){
	it('it should GET a post by the given id', function(done){
		var post = new Post({
			title: 'New Test find by slug',
			body: 'Just testing purpose'
		});
		post.save(function(err, post){
			chai.request(server)
				.get('/posts/' + post.slug)
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('body');
					res.body.should.have.property('created');
					res.body.should.have.property('status');
					res.body.should.have.property('_id').eql(post.id);
					done();
				});
		});
	});
});

/* Test /PUT Route */
describe('/PUT/:id post', function(){
	it('it should UPDATE a post by the given id', function(done){
		var post = new Post({
			title: 'New Test for Update method',
			body: 'Just for testing purpose'
		});
		post.save(function(err, post){
			chai.request(server)
				.put('/posts/' + post.id)
				.set('Authorization', 'Bearer '+ token)
				.send({title: 'Now title has been updated', body: 'Body has been updated'})
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Post updated Successfully!!');
					res.body.should.have.property('result', true);
					done();
				});
		});
	});
});

/* Test /DELETE Route */
describe('/DELETE/:id post', function(){
	it('it should DELETE a post by the given id', function(done){
		var post = new Post({
			title: 'New Test for Update method',
			body: 'Just for testing purpose'
		});
		post.save(function(err, post){
			chai.request(server)
				.delete('/posts/' + post.id)
				.set('Authorization', 'Bearer '+ token)
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Post has deleted Successfully');
					res.body.should.have.property('result', true);
					done();
				});
		});
	});
});