(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('PostController', ['$scope', '$http',function($scope, $http){
		$scope.paging = {page: 1};
		var load = function () {
			$http.get('/posts/paginate', {params: {page: $scope.paging.page}}).then(function(response){
				$scope.posts = response.data.records;
				$scope.paging = response.data.paging;
			});	
		};
		$scope.pageChanged = function () {
		   	load();
		};
		load();
	}]);
}());