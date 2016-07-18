(function() {
	'use strict';

	angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers', 'app.factories', 'app.directives','ui.bootstrap'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'posts/views/posts.html', 
			controller: 'PostController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
}());	