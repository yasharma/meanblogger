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
				return $http.get((apiUrl + p ), q).then(function(response){
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
			getById: function(option){
				return $http.get(option.apiUrl + option.id).then(function(response){
					return {
						record: response.data.record
					};
				});	
			},
			post: function(option){
				return $http.post(option.apiUrl, option.data).then(function(response){
					return {
						type: response.data.message.type,
						text: response.data.message.text
					};
				});
			},
			put: function(option){
				return $http.put((option.apiUrl + option.id), option.data).then(function(response){
					return {
						type: response.data.message.type,
						text: response.data.message.text
					};
				});
			},
			delete: function(option){
				return $http.delete((option.apiUrl + option.id)).then(function(response){
					return {
						type: response.data.message.type,
						text: response.data.message.text
					};
				});	
			}
		};
	}]);
}());