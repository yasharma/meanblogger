(function(){
	'use strict';

	var gulp 		= require('gulp'),
		jshint 		= require('gulp-jshint'),
		uglify 		= require('gulp-uglify'),
		pump 		= require('pump'),
		concat 		= require('gulp-concat'),
		nodemon 	= require('gulp-nodemon'),
		cleanCSS 	= require('gulp-clean-css');

	gulp.task('app', function (cb) {
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

	gulp.task('admin-app', function (cb) {
	  	pump([
	        gulp.src([
	        	'./modules/factories/*.js',
	        	'./modules/directives/*.js',
	        	'./modules/admin-app.js',
	        	'./modules/admin/controllers/*.js',
	        	'./modules/dashboard/controllers/*.js',
	        	'./modules/category/controllers/*.js'
	        ]),
	        concat('admin-app.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],cb 
	    );
	});

	/* Required javascript libraries for front-end */
	gulp.task('front-site', function (cb) {
	  	pump([
	        gulp.src([
	        	'./public/*/angular/angular.min.js',
	        	'./public/*/angular-animate/angular-animate.min.js',
	        	'./public/*/textAngular/dist/textAngular-sanitize.min.js',
	        	'./public/*/angular-touch/angular-touch.min.js',
	        	'./public/*/angular-bootstrap/ui-bootstrap-tpls.min.js',
	        	'./public/*/angular-route/angular-route.min.js',
	        	'./public/*/angular-loading-bar/build/loading-bar.min.js',
	        ]),
	        concat('site.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],cb 
	    );
	});

	/* Required javascript libraries for admin panel */
	gulp.task('admin-site', function (cb) {
	  	pump([
	        gulp.src([
	        	'./public/*/jquery/dist/jquery.min.js',
                './public/*/bootstrap/dist/js/bootstrap.min.js',
                './public/*/AdminLTE/dist/js/app.min.js',
	        	'./public/*/angular/angular.min.js',
	        	'./public/*/angular-route/angular-route.min.js',
	        	'./public/*/angular-animate/angular-animate.min.js',
	        	'./public/*/angular-touch/angular-touch.min.js',
	        	'./public/*/angular-bootstrap/ui-bootstrap-tpls.min.js',
	        	'./public/*/angular-loading-bar/build/loading-bar.min.js',
                './public/*/angular-local-storage/dist/angular-local-storage.min.js',
                './public/*/angular-file-upload/dist/angular-file-upload.min.js',
                './public/*/textAngular/dist/textAngular-rangy.min.js',
                './public/*/textAngular/dist/textAngular-sanitize.min.js',
                './public/*/textAngular/dist/textAngular.min.js',
                './public/*/AngularJS-Toaster/toaster.min.js'
	        ]),
	        concat('admin-site.min.js'),
	        uglify({mangle: false}),
	        gulp.dest('./public/js/')
	    ],cb 
	    );
	});

	gulp.task('jshint', ['app','admin-app'], function() {
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
			ignore: ['node_modules/','public/bower_components/','public/js/', 'test/', 'coverage/'],
		})
		.on('restart', function(){
			console.log('restarted');
		});
	});

	gulp.task('site-css', function() {
		return gulp.src([
				'./public/*/angular-loading-bar/build/loading-bar.min.css',
				'./public/*/bootstrap/dist/css/bootstrap.min.css',
				'./public/css/blog.css',
			])
			.pipe(concat('site.min.css'))
	    	.pipe(cleanCSS({compatibility: 'ie8'}))
	    	.pipe(gulp.dest('./public/css/'));
	});

	gulp.task('admin-site-css', function() {
		return gulp.src([
				'./public/*/angular-loading-bar/build/loading-bar.min.css',
                './public/*/bootstrap/dist/css/bootstrap.min.css',
                './public/*/font-awesome/css/font-awesome.min.css',
                './public/*/Ionicons/css/ionicons.min.css',
                './public/*/AdminLTE/dist/css/AdminLTE.min.css',
                './public/*/AdminLTE/dist/css/skins/skin-purple.min.css',
                './public/*/textAngular/dist/textAngular.css',
                './public/*/AngularJS-Toaster/toaster.min.css',
                './public/css/admin.css'
			])
			.pipe(concat('admin-site.min.css'))
	    	.pipe(cleanCSS({compatibility: 'ie8', processImport: false}))
	    	.pipe(gulp.dest('./public/css/'));
	});

	gulp.task('default', ['nodemon','app','front-site','admin-site','admin-app','site-css','admin-site-css']);
}());	