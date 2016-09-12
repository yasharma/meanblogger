(function() {
	'use strict';

	angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize','app.controllers', 'app.factories', 'app.directives','ui.bootstrap','angular-loading-bar'])
	.config(['$routeProvider', 'cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			templateUrl: 'posts/views/posts.html', 
			controller: 'PostController'	
		})
		.when('/:slug', {
			templateUrl: 'posts/views/single.html', 
			controller: 'ViewPostController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
}());	