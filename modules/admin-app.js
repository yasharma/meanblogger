(function() {
	'use strict';

	angular.module('app', ['ngRoute','app.controllers', 'textAngular','app.factories', 'toaster','app.directives','ngAnimate','angular-loading-bar','ui.bootstrap','LocalStorageModule','angularFileUpload'])
	.config(['$routeProvider','cfpLoadingBarProvider', '$httpProvider', function($routeProvider, cfpLoadingBarProvider, $httpProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			templateUrl: 'admin/views/login.html', 
			controller: 'AdminController'
		})
		.when('/dashboard', {
			templateUrl: 'dashboard/views/dashboard.html', 
			controller: 'DashboardController'
		})
		.when('/posts', {
			templateUrl: 'admin/views/admin_posts.html', 
			controller: 'AdminPostController'
		})
		.when('/create', {
			templateUrl: 'admin/views/create_posts.html', 
			controller: 'CreateController'
		})
		.when('/edit-post/:id', {
			templateUrl: 'admin/views/create_posts.html', 
			controller: 'EditPostController'
		})
		.when('/category', {
			templateUrl: 'category/views/category.html', 
			controller: 'CategoryController'
		})
		.when('/create-category', {
			templateUrl: 'category/views/create_category.html', 
			controller: 'NewCategoryController'
		})
		.when('/edit-category/:id', {
			templateUrl: 'category/views/create_category.html', 
			controller: 'EditCategoryController'
		})
		.otherwise({
			redirectTo: '/'
		});
	

		$httpProvider.defaults.useXDomain = true;
    	delete $httpProvider.defaults.headers.common['X-Requested-With'];
		var interceptor = ['$q', '$window', '$rootScope', 'localStorageService', 'AuthenticationService','$timeout',function ($q, $window, $rootScope, localStorageService, AuthenticationService, $timeout) {

	        return {
	        	request: function (config) {
		           	config.headers = config.headers || {};
		           	var token = localStorageService.get('token');
		           	if (token) {
		               	config.headers.Authorization = 'Bearer '+ token;
		               	AuthenticationService.isLogged = 1;
	                    $rootScope.isLogged = 1;
		           	}
		           	return config;
		       	},

	            requestError: function (rejection) {
	                return $q.reject(rejection);
	            },

	            response: function (response) {
	                
	                $timeout(function () { 
	                	$rootScope.Message = {type: 'fade'};
	                }, 5000);	

	                return response || $q.when(response);
	            },

	            // Revoke client authentication if 400 is received

	            responseError: function (rejection) {
	                
	                if (rejection !== null && rejection.status === 400) {

	                	
	                	localStorageService.remove('token');
	                	localStorageService.remove('user');
	                	AuthenticationService.isLogged = false;
	                	$rootScope.isLogged = false;
	                	$window.location.href = "admin.html";
	                }
	                return $q.reject(rejection);
	            }
	        };
	    }];

    	$httpProvider.interceptors.push(interceptor);

	}])
	.run(['$rootScope', '$location', 'localStorageService', 'AuthenticationService',function ($rootScope, $location, localStorageService, AuthenticationService) {
		$rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
			if ( nextRoute !== null && !AuthenticationService.isLogged && !localStorageService.get('user')) {
			    AuthenticationService.isLogged = 0;
			    $location.path("/");
			} else {
				var token = localStorageService.get('token');
				if($location.path() == '/' && token ){
					$location.path("/dashboard");
				}
			}
			
		});

		// logout
	    $rootScope.clearToken = function () {
	        localStorageService.remove('token');
	        localStorageService.remove('user');
	        $rootScope.isLogged = false;
	        delete $rootScope.user;
	        $location.path('/');
	    };


		$rootScope.user = localStorageService.get('user');
	}]);
	angular.module('app.controllers', []);

}());	