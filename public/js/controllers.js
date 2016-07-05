(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('AppController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope){
		//var protocol = $location.protocol();
		//$rootScope.appURL = $location.host();
	}])
	.controller('PostController', ['$scope', '$http', '$uibModal', 'socketio', function($scope, $http, $uibModal, socketio){	
		
		var load = function () {
			$http.get('/api/posts').then(function(response){
				$scope.posts = response.data;
			});	
		}	
		
		load();

		socketio.on('syncposts', function(){
			load();
		});

		$scope.open = function (size) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'createPost.html',
				controller: NewPostCreated
			});
		};

		$scope.deletePost = function(index){
			var e = $scope.posts[index];
			$http.delete('/api/posts/'+ e._id).then(function(response){
				socketio.emit('syncposts');
			});
		};
		
		function NewPostCreated($scope, $uibModalInstance) {
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};	

			$scope.save = function(){
				$http.post('/api/posts', $scope.post).then(function(response){
					socketio.emit('syncposts');
					$uibModalInstance.close();
				});
			};
		}
	}]);
}());