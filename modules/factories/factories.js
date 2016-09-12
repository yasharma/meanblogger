(function() {
	'use strict';

	angular.module('app.factories', [])
	.factory('AuthenticationService', function () {
	    var auth = {
	        isLogged: false
	    };
	    return auth;
	})
	/*.factory('socketio', ['$rootScope', '$location',function ($rootScope, $location) {
		
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	}])*/
	.factory('RestSvr', ['$http', function ($http) {
		return{
			login: function(apiUrl, data){
				return $http.post(apiUrl, data).then(function(response){
					return (response.data.errors) ? { 
						errors: response.data.errors 
					} : { 
						user: response.data.user,
						token: response.data.token
					};
				});
			},
			paginate: function(apiUrl, params, queryString){
				var p = !angular.isUndefined(params) ? params : '';
				var q = !angular.isUndefined(queryString) ? queryString : '';
				return $http.get(apiUrl, p).then(function(response){
					return {
						records: response.data.records,
						paging: response.data.paging
					};
				});
			},
			get: function(apiUrl, params){
				var p = !angular.isUndefined(params) ? params : null;
				return $http.get(apiUrl, params).then(function(response){
					return {
						records: response.data.records
					};
				});
			},
			getById: function(apiUrl, id){
				return $http.get(apiUrl + id).then(function(response){
					return {
						record: response.data
					};
				});	
			},
			post: function(apiUrl, data){
				return $http.post(apiUrl, data).then(function(response){
					return (response.data.code === 11000 && response.data.name === "MongoError") ?
					{result: false, message: 'Category already exist'} :
					{result: response.data.result, message: response.data.message, record: response.data.record };
				});
			},
			put: function(apiUrl, id, data){
				return $http.put((apiUrl + id), data).then(function(response){
					return (response.data.code === 11000 && response.data.name === "MongoError") ?
					{result: false, message: 'Category already exist'} :
					{result: response.data.result, message: response.data.message, record: response.data.record };
				});
			},
			delete: function(apiUrl, id){
				return $http.delete(apiUrl + id).then(function(response){
					return {
						message: response.data.message,
						result: response.data.result
					};
				});	
			}
		};
	}]);
}());