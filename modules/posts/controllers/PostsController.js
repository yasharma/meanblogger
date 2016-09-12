(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('PostController', ['$scope', 'RestSvr', '$location', function($scope, RestSvr, $location){
		$scope.paging = {page: 1};
		var load = function () {
			RestSvr.paginate('/posts/paginate', {
				params: {
					page: $scope.paging.page,
					status: true
				}
			}).then(function(response){
				$scope.posts = response.records;
				$scope.paging = response.paging;
			});	
		};
		$scope.pageChanged = function () {
		   	load();
		};
		load();

		$scope.viewPost = function(index){
			$location.path('/' + $scope.posts[index].slug);
		};
	}])
	.controller('ViewPostController', ['$scope', 'RestSvr', '$routeParams',function($scope, RestSvr, $routeParams){
		RestSvr.getById('/posts/',  $routeParams.slug).then(function(response){
			$scope.Post = response.record;
		});
	}]);
}());