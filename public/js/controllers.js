(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('AppController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope){
		//var protocol = $location.protocol();
		//$rootScope.appURL = $location.host();
	}])
	.controller('PostController', ['$scope', '$http', '$uibModal', 'socketio', function($scope, $http, $uibModal, socketio){	
		$scope.paging = {page: 1};
		var load = function () {
			$http.get('/api/posts/paginate', {params: {page: $scope.paging.page}}).then(function(response){
				$scope.posts = response.data.records;
				$scope.paging = response.data.paging;
			});	
		}	

		$scope.pageChanged = function () {
		   	load();
		};
		
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

		$scope.updatePost = function(index){
			var e = $scope.posts[index];
			$http.get('/api/posts/'+ e._id).then(function(response){
				
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'createPost.html',
					bindToController: true,
					controller: updateSelectedPost,
					resolve: {
						post: function() {
							return response.data;
						}
					}
				});
			});
		};
		
		function NewPostCreated($scope, $uibModalInstance) {
			$scope.modelTitle = 'Create Post';
			$scope.button = 'Save';
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

		function updateSelectedPost($scope, $uibModalInstance, post){
			$scope.modelTitle = 'Update Post';
			$scope.button = 'Update';
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.post = post;
			$scope.save = function(){
				$http.put('/api/posts/'+post._id, $scope.post).then(function(response){
					socketio.emit('syncposts');
					$uibModalInstance.close();
				});
			};
		}

		$scope.fieldName = 'date';
		$scope.reverse = false;

		$scope.sortBy = function(fieldName) {
			$scope.reverse = ($scope.fieldName === fieldName) ? !$scope.reverse : false;
			$scope.fieldName = fieldName;
		};	
	}]);
}());