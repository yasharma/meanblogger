(function(){
	'use strict';

	var gulp 	= require('gulp'),
		jshint 	= require('gulp-jshint'),
		uglify 	= require('gulp-uglify'),
		pump 	= require('pump'),
		concat 	= require('gulp-concat'),
		nodemon = require('gulp-nodemon');

	gulp.task('compress', function (cb) {
	  pump([
	        gulp.src([
	        	'./modules/app.js',
	        	'./modules/factories/*.js',
	        	'./modules/posts/controllers/*.js'
	        ]),
	        concat('app.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],
	    cb
	  );
	});

	gulp.task('jshint', ['compress'],function() {
		return gulp.src([
			'server.js', 
			'./app/**/*.js',
			'./config/*.js',
			'./controllers/*.js',
			'./modules/*.js',
	    	'./modules/factories/*.js',
	    	'./modules/**/controllers/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
	});

	gulp.task('nodemon', function () {
		nodemon({
			tasks: ['jshint'],
			script: 'server.js',
			ext: 'js html',
			ignore: ['node_modules/'],
			watch: [
				'app/*/Post.js',
				'config/*.js', 
				'controllers/*.js', 
				'modules/factories/*.js',
				'modules/*.js',
				'gulpfile.js',
				'server.js'
			]
		})
		.on('restart', function(){
			console.log('restarted');
		});
	});

	gulp.task('default', ['nodemon','compress']);
}());	