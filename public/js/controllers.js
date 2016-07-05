(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('AppController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope){
		//var protocol = $location.protocol();
		//$rootScope.appURL = $location.host();
	}])
	.controller('PostController', ['$scope', '$http', '$uibModal',  function($scope, $http, $uibModal){	
		
		var load = function () {
			$http.get('/api/posts').then(function(response){
				$scope.posts = response.data;
			});	
		}	
		
		load();
		$scope.open = function (size) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'createPost.html',
				controller: NewPostCreated,
				resolve: {
					post: function () {
						load();
						return $scope.posts;
					}
				}
			});
		};
		
		function NewPostCreated($scope, $uibModalInstance, post) {
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};	

			$scope.save = function(){
				$http.post('/api/posts', $scope.post).then(function(response){
					load();
					$uibModalInstance.close();
				});
			};
		}
	}]);
}());