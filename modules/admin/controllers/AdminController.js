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
	}])
	.controller('AdminPostController', ['$scope', 'RestSvr', 'toaster',function($scope, RestSvr, toaster){
		var load = function () {
			$scope.paging = {page: 1};
			RestSvr.paginate('/posts/paginate', {params: {page: $scope.paging.page}}).then(function(response){
				$scope.posts = response.records;
				$scope.paging = response.paging;
			});	
		};
		$scope.pageChanged = function () {
		   	load();
		};
		$scope.editCategory = function(index){
			$location.path('/edit-posts/' + $scope.posts[index]._id);
		};
		$scope.toggleStatus = function (index) {
			var e = $scope.posts[index],
				status = {true : false, false: true};
			e.status = status[e.status];
			RestSvr.put('posts/' , e._id , e).then(function(response){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				load();
			});
		};
		$scope.deletePost = function(index){
			var e = $scope.posts[index];
			RestSvr.delete('/posts/', e._id).then(function(response){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				load();
			});
		};
		load();
	}])
	.controller('CreateController', ['$scope', '$location','FileUploader','localStorageService','$window','$timeout','toaster',function($scope, $location,FileUploader,localStorageService,$window,$timeout,toaster){
			
		$scope.uploader = new FileUploader({
		    url: '/posts',
		    headers: { Authorization : 'Bearer '+ localStorageService.get('token') },
		    alias: 'image',
		});

		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		$scope.uploader.onBeforeUploadItem = function(item) {
			item.formData.push($scope.post);
		};

		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      		console.log(response.message);	

      		// Show error message
      		//$scope.error = response.message;
    	};

		$scope.uploader.onSuccessItem = function(item, response, status, headers) {
			$scope.uploader.clearQueue();
			if(response.post){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				$location.path('/posts');
			}
		};

		$scope.save = function(){
			$scope.uploader.uploadAll();
		};
	}])
	.controller('EditPostController', ['$scope', '$location','FileUploader','localStorageService','$window','$timeout','toaster','$routeParams',function($scope, $location,FileUploader,localStorageService,$window,$timeout,toaster, routeParams){
		RestSvr.getById('post/', $routeParams.id).then(function(response) {
            $scope.post = response.record;
        });			
		$scope.uploader = new FileUploader({
		    url: '/posts',
		    headers: { Authorization : 'Bearer '+ localStorageService.get('token') },
		    alias: 'image',
		});

		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		$scope.uploader.onBeforeUploadItem = function(item) {
			item.formData.push($scope.post);
		};

		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      		console.log(response.message);	

      		// Show error message
      		//$scope.error = response.message;
    	};

		$scope.uploader.onSuccessItem = function(item, response, status, headers) {
			$scope.uploader.clearQueue();
			if(response.post){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				$location.path('/posts');
			}
		};

		$scope.save = function(){
			$scope.uploader.uploadAll();
		};
	}]);	
}());