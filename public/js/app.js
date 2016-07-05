(function() {
'use strict';

angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers', 'ui.bootstrap'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'views/posts.html', 
			controller: 'PostController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
}());	