(function() {
	'use strict';

	angular.module('app.controllers')
	.controller('AdminController', ['$scope', '$rootScope', 'RestSvr', 'localStorageService', 'AuthenticationService', '$location',function($scope, $rootScope, RestSvr, localStorageService, AuthenticationService, $location){
		console.log('Admin');
		$scope.login = function(isValid){
			if(!isValid) return;
			RestSvr.login('/users/login', $scope.user).then(function(response){
				$scope.error = null;
				if(response.errors){
					$scope.error = response.errors;
				} else {
					localStorageService.set('token', response.token);
					localStorageService.set('user', {
					    "id": response.user._id,
					    "username": response.user.username,
					    "email": response.user.email,
					    "status": response.user.status,
					    "created": response.user.created,
					});
					AuthenticationService.isLogged = true;
                	$rootScope.isLogged = true;
					$rootScope.user = localStorageService.get('user');
					$location.path('/dashboard');
				}
			});
		};
	}]);
}());