(function() {
	'use strict';

	angular.module('app.controllers')
	.controller('CategoryController', ['$scope', 'RestSvr', 'toaster', '$location',function($scope, RestSvr, toaster, $location){
		$scope.paging = {page: 1};
		var load = function () {
			RestSvr.paginate('/category/paginate', {params: {page: $scope.paging.page}}).then(function(response){
				$scope.categories = response.records;
				$scope.paging = response.paging;
			});	
		};
		$scope.pageChanged = function () {
		   	load();
		};
		$scope.editCategory = function(index){
			$location.path('/edit-category/' + $scope.categories[index]._id);
		};
		$scope.deleteCategory = function(index){
			var e = $scope.categories[index];
			RestSvr.delete('/category/', e._id).then(function(response){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				load();
			});
		};
		$scope.toggleStatus = function (index) {
			var e = $scope.categories[index],
				status = {true : false, false: true};
			e.status = status[e.status];
			RestSvr.put('category/' , e._id , e).then(function(response){
				toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
				load();
			});
		};
		load();
	}])
	.controller('NewCategoryController', ['$scope', 'RestSvr', '$location', 'toaster',function($scope, RestSvr, $location, toaster){
		$scope.heading = 'Create a New Category';
		$scope.buttonName = 'Create';
		$scope.save = function(isValid){
			if(!isValid) return;
			RestSvr.post('/category/create',$scope.category).then(function(response){
				if(response.result) {
					toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
					$location.path('/category');
				} else {
					toaster.pop({type: 'error', title: "Error", body:response.message, showCloseButton:true});
				}
			});
		};

		$scope.cancel = function () { $location.path('/category'); };
	}])
	.controller('EditCategoryController', ['$scope','$location', '$rootScope', 'RestSvr', '$routeParams', 'toaster',function($scope, $location, $rootScope, RestSvr, $routeParams, toaster){
		$scope.heading = 'Update Category';
		$scope.buttonName = 'Update';
		RestSvr.getById('category/', $routeParams.id).then(function(response) {
            $scope.category = response.record;
        });
		$scope.save = function(isValid){
			if (!isValid) return;
			RestSvr.put('category/', $scope.category._id, $scope.category ).then(function(response){
				if(response.result) {
					toaster.pop({type: 'success', title: "Success", body:response.message, showCloseButton:true});
					$location.path('/category');
				} else {
					toaster.pop({type: 'error', title: "Error", body:response.message, showCloseButton:true});
				}
			});
		};

		$scope.cancel = function () { $location.path('/category'); };
	}]);
}());