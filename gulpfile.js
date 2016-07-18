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
	        	'./modules/directives/*.js',
	        	'./modules/posts/controllers/*.js'
	        ]),
	        concat('app.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],cb 
	    );
	});

	gulp.task('assets', function (cb) {
	  	pump([
	        gulp.src([
	        	'./public/*/angular/angular.min.js',
	        	'./public/*/angular-animate/angular-animate.min.js',
	        	'./public/*/angular-touch/angular-touch.min.js',
	        	'./public/*/angular-bootstrap/ui-bootstrap-tpls.min.js',
	        	'./public/*/angular-route/angular-route.min.js',
	        ]),
	        concat('site.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],cb 
	    );
	});

	gulp.task('jshint', ['compress'], function() {
		return gulp.src([
			'server.js', 
			'./app/**/*.js',
			'./config/*.js',
			'./controllers/*.js',
			'./modules/*.js',
	    	'./modules/factories/*.js',
	    	'./modules/directives/*.js',
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
				'app/*/*.js',
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

	gulp.task('default', ['nodemon','compress','assets']);
}());	